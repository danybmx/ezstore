package ezstore.services;

import ezstore.annotations.Secured;
import ezstore.entities.Order;
import ezstore.entities.Tax;
import ezstore.entities.structs.Role;
import ezstore.helpers.AuthorizedServiceHelper;
import ezstore.helpers.ErrorHelper;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.util.Date;
import java.util.List;

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

    @POST
    @Secured(Role.ADMIN)
    @Path("/mng")
    public Response createOrder(Order newOrder) {
        try {
            Order order = em.merge(newOrder);
            return Response.ok().entity(order).build();
        } catch (Exception e) {
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
                    orderUpdate.setModifiedAt(new Date());
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
        Order order = em.find(Order.class, id);
        if (order != null) {
            em.remove(order);
            return Response.ok().build();
        }
        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

}
