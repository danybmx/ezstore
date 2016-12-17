package ezstore.services;

import ezstore.annotations.Secured;
import ezstore.entities.*;
import ezstore.entities.structs.OrderType;
import ezstore.entities.structs.Role;
import ezstore.exceptions.NoStockException;
import ezstore.helpers.AuthorizedServiceHelper;
import ezstore.helpers.ErrorHelper;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/orders")
@Transactional
public class OrdersService extends AuthorizedServiceHelper {

    @PersistenceContext
    private EntityManager em;

    @GET
    @Secured
    public Response getCurrentUserOrders() {
        List<Order> orders = em
                .createQuery("SELECT o FROM Order o WHERE customer.id = :id", Order.class)
                .setParameter("id", getCurrentUser().getId())
                .getResultList();

        return Response.ok().entity(orders).build();
    }

    @GET
    @Path("/{id}")
    @Secured
    public Response getCurrentUserOrder(@PathParam("id") Long id) {
        Order order = em.find(Order.class, id);
        if (order != null) {
            if (order.getCustomer().getId().equals(id)) {
                return Response.ok().entity(order).build();
            } else {
                return ErrorHelper.createResponse(Response.Status.FORBIDDEN);
            }
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @POST
    @Secured
    public Response createCurrentUserOrder(Order newOrder) {
        newOrder.setCustomer(getCurrentUser());
        try {
            updateStock(newOrder.getStorage(), null, newOrder);
            Order order = em.merge(newOrder);
            return Response.ok().entity(order).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ErrorHelper.createResponse(e);
        }
    }

    @PUT
    @Secured
    public Response updateCurrentUserOrder(Order orderUpdate) {
        Order currentOrder = em.find(Order.class, orderUpdate.getId());

        if (currentOrder != null) {
            if (currentOrder.getCustomer().getId().equals(getCurrentUser().getId())) {
                try {
                    updateStock(currentOrder.getStorage(), currentOrder, orderUpdate);
                    orderUpdate.setModifiedAt(new Date());
                    Order order = em.merge(orderUpdate);
                    return Response.ok().entity(order).build();
                } catch (Exception e) {
                    e.printStackTrace();
                    return ErrorHelper.createResponse(e);
                }
            } else {
                return ErrorHelper.createResponse(Response.Status.FORBIDDEN);
            }
        } else {
            return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
        }
    }

    /**
     * ADMIN
     */
    @GET
    @Secured(Role.ADMIN)
    @Path("/mng")
    public Response getOrders() {
        List<Order> orders = em
                .createQuery("SELECT o FROM Order o", Order.class)
                .getResultList();

        return Response.ok().entity(orders).build();
    }

    @GET
    @Path("/mng/{id}")
    @Secured(Role.ADMIN)
    public Response getOrder(@PathParam("id") Long id) {
        Order order = em.find(Order.class, id);
        if (order != null) {
            return Response.ok().entity(order).build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @GET
    @Path("/mng/upgrade/{id}")
    @Secured(Role.ADMIN)
    public Response upgradeOrder(@PathParam("id") Long id) {
        Order order = em.find(Order.class, id);
        if (order != null) {
            switch (order.getOrderType()) {
                case BUDGET:
                case ORDER:
                case PROFORMA:
                default:
                    ErrorHelper.createResponse(Response.Status.BAD_REQUEST, "Thar order can't be upgraded");
            }
            return Response.ok().entity(order).build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @POST
    @Secured(Role.ADMIN)
    @Path("/mng")
    public Response createOrder(Order newOrder) {
        try {
            // Get reference
            newOrder.setReference(generateReference(newOrder.getOrderType()));

            Order order = em.merge(newOrder);
            updateStock(order.getStorage(), null, order);

            return Response.ok().entity(order).build();
        } catch (NoStockException e) {
            e.printStackTrace();
            return ErrorHelper.createResponse(e);
        }
    }

    @PUT
    @Path("/mng/{id}")
    @Secured(Role.ADMIN)
    public Response updateOrder(@PathParam("id") Long id, Order orderUpdate) {
        if (orderUpdate.getId().equals(id)) {
            Order currentOrder = em.find(Order.class, orderUpdate.getId());

            if (currentOrder != null) {
                try {
                    orderUpdate.setReference(currentOrder.getReferenceNumber());
                    orderUpdate.setModifiedAt(new Date());

                    updateStock(orderUpdate.getStorage(), currentOrder, orderUpdate);
                    Order order = em.merge(orderUpdate);
                    return Response.ok().entity(order).build();
                } catch (Exception e) {
                    e.printStackTrace();
                    return ErrorHelper.createResponse(e);
                }
            } else {
                return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
            }
        } else {
            return ErrorHelper.createResponse(Response.Status.BAD_REQUEST);
        }
    }

    @DELETE
    @Path("/mng/{id}")
    @Secured(Role.ADMIN)
    public Response deleteOrder(@PathParam("id") Long id) {
        try {
            Order order = em.find(Order.class, id);
            if (order != null) {
                updateStock(order.getStorage(), order, null);
                em.remove(order);
                return Response.ok().build();
            }
        } catch (NoStockException exception) {
            return ErrorHelper.createResponse(exception);
        }
        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @GET
    @Path("/types")
    @Secured(Role.ADMIN)
    public Response getTypes() {
        Map<Integer, String> orderTypes = new HashMap<>();
        int index = 0;

        for (OrderType orderType : OrderType.values()) {
            orderTypes.put(index++, orderType.toString());
        }

        return Response.ok().entity(orderTypes).build();
    }

    private Integer generateReference(OrderType orderType) {
        try {
            Integer lastOrderReference = em
                    .createQuery("SELECT o.reference FROM Order o WHERE o.orderType=:orderType ORDER BY o.reference DESC", Integer.class)
                    .setMaxResults(1)
                    .setParameter("orderType", orderType)
                    .getSingleResult();
            return lastOrderReference+1;
        } catch (NoResultException exception) {
            return 1;
        }
    }

    private boolean updateStock(Storage storage, Order orderFrom, Order orderTo) throws NoStockException {
        OrderType orderType = null;
        if (orderFrom != null) {
            orderType = orderFrom.getOrderType();
        } else if (orderTo != null) {
            orderType = orderTo.getOrderType();
        }
        if (orderType != null && orderType.equals(OrderType.BUDGET)) {
            return true;
        }

        HashMap<Long, Integer> stockUpdate = new HashMap<>();
        HashMap<Long, Integer> unitsPreviouslyRemoved = new HashMap<>();
        HashMap<Long, Integer> unitsToRemove = new HashMap<>();

        // Units that has been removed before
        if (orderFrom != null) {
            List<OrderProduct> orderProductsFrom = orderFrom.getProducts();
            for (OrderProduct or : orderProductsFrom) {
                if (!or.getOption().isDeleted()) {
                    Integer units = or.getUnits();

                    if (unitsPreviouslyRemoved.get(or.getOption().getId()) != null) {
                        units += unitsPreviouslyRemoved.get(or.getOption().getId());
                    }

                    unitsPreviouslyRemoved.put(or.getOption().getId(), units);
                }
            }
        }

        // Units that needs to be removed
        if (orderTo != null) {
            List<OrderProduct> orderProductsTo = orderTo.getProducts();
            for (OrderProduct or : orderProductsTo) {
                if (!or.getOption().isDeleted()) {
                    Integer units = or.getUnits();

                    if (stockUpdate.get(or.getOption().getId()) != null) {
                        units += stockUpdate.get(or.getOption().getId());
                    }

                    unitsToRemove.put(or.getOption().getId(), units);
                }
            }
        }

        unitsToRemove.forEach((optionId, units) -> {
            if (unitsPreviouslyRemoved.containsKey(optionId)) {
                stockUpdate.put(optionId, unitsPreviouslyRemoved.get(optionId) - units);
            } else {
                stockUpdate.put(optionId, units * -1);
            }
        });

        unitsPreviouslyRemoved.forEach((optionId, units) -> {
            if (!unitsToRemove.containsKey(optionId)) {
                stockUpdate.put(optionId, units);
            }
        });

        for (HashMap.Entry<Long, Integer> sUpdate : stockUpdate.entrySet()) {
            Long optionId = sUpdate.getKey();
            Integer units = sUpdate.getValue();

            ProductOption option = em.find(ProductOption.class, optionId);
            if (option.getStock() != null) {
                for (Stock stock: option.getStock()) {
                    if (stock.getStorage().getId().equals(storage.getId())) {
                        Integer futureUnits = stock.getUnits() + units;

                        if (futureUnits < 0) {
                            Integer availableUnits = stock.getUnits();
                            if (unitsPreviouslyRemoved.get(option.getId()) != null) {
                                availableUnits += unitsPreviouslyRemoved.get(option.getId());
                            }
                            throw new NoStockException(
                                    option.getProduct().getName() + ' ' + option.getName(),
                                    option.getProduct().getId(),
                                    option.getId(),
                                    availableUnits
                            );
                        }
                        stock.setUnits(futureUnits);
                        em.persist(stock);
                    }
                }
            }
        }

        return true;
    }

}
