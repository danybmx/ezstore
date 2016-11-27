package ezstore.services;

import ezstore.entities.ProductOption;
import ezstore.entities.Stock;
import ezstore.entities.Storage;
import ezstore.helpers.ErrorHelper;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/products/{productId}/options/{optionId}/stock")
@Transactional
public class StockService {

    @PersistenceContext
    private EntityManager em;

    @PUT
    @Path("/{storageId}/{units}")
    @Produces(MediaType.APPLICATION_JSON)
    public Stock setOptionStock(@PathParam("optionId") Long optionId, @PathParam("storageId") Long storageId, @PathParam("units") int units) {
        ProductOption option = em.find(ProductOption.class, optionId);

        if (option.getStock() != null) {
            for (Stock stock: option.getStock()) {
                if (stock.getStorage().getId().equals(storageId)) {
                    stock.setUnits(units);
                    em.persist(stock);
                    return stock;
                }
            }
        }

        Storage storage = em.find(Storage.class, storageId);
        Stock stock = new Stock(storage, units);
        option.getStock().add(stock);
        em.persist(option);

        return stock;
    }

    @GET
    @Path("/{storageId}/")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOptionStock(@PathParam("optionId") Long optionId, @PathParam("storageId") Long storageId) {
        ProductOption option = em.find(ProductOption.class, optionId);
        if (option.getStock() != null) {
            for (Stock stock: option.getStock()) {
                if (stock.getStorage().getId().equals(storageId)) {
                    return Response.ok(stock).build();
                }
            }
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOptionStock(@PathParam("optionId") Long optionId) {
        ProductOption option = em.find(ProductOption.class, optionId);
        return Response.ok(option.getStock()).build();
    }
}
