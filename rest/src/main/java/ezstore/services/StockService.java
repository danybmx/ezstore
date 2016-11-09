package ezstore.services;

import ezstore.entities.Product;
import ezstore.entities.ProductOption;
import ezstore.entities.Stock;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;

@Path("/stock")
@Transactional
public class StockService {

    @PersistenceContext
    private EntityManager em;

    @GET
    @Path("/option/{storageId}/{optionId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Stock getOptionStock(@PathParam("optionId") Long optionId, @PathParam("storageId") Long storageId) {
        return em.createQuery("SELECT u FROM Stock u WHERE u.storage.id = :optionId AND u.option.id = :storageId", Stock.class)
                .setParameter("optionId", optionId)
                .setParameter("storageId", storageId)
                .getSingleResult();
    }

    @GET
    @Path("/product/{storageId}/{productId}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Stock> getProductStock(@PathParam("productId") Long productId, @PathParam("storageId") Long storageId) {
        List<Stock> productOptionsStock = new ArrayList<>();
        Product product = em.find(Product.class, productId);

        if (product != null) {
            for (ProductOption productOption : product.getOptions()){
                productOptionsStock.add(em.createQuery("SELECT u FROM Stock u WHERE u.storage.id = :optionId AND u.option.id = :storageId", Stock.class)
                        .setParameter("optionId", productOption.getId())
                        .setParameter("storageId", storageId)
                        .getSingleResult());
            }
        }

        return productOptionsStock;
    }

}
