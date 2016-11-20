package ezstore.services;

import ezstore.entities.Product;
import ezstore.entities.ProductOption;
import ezstore.entities.Stock;
import ezstore.entities.Storage;
import ezstore.helpers.ErrorHelper;
import ezstore.messages.ProductOptionMessage;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/products/{productId}/options")
@Transactional
public class ProductOptionsService {

    @PersistenceContext
    private EntityManager em;

    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductOptions(@PathParam("productId") Long productId) {
        Product product = em.find(Product.class, productId);

        if (product != null) {
            return Response.ok(product.getOptions()).build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @POST
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createProductOption(
            @PathParam("productId") Long productId,
            ProductOptionMessage productOptionMessage) {
        Product product = em.find(Product.class, productId);

        if (product != null) {
            if (productOptionMessage.isValid()) {
                ProductOption productOption = new ProductOption();
                productOption.setName(productOptionMessage.getName());
                productOption.setPrice(productOptionMessage.getPrice());
                productOption.setEan(productOptionMessage.getEAN());
                productOption.setReference(productOptionMessage.getReference());
                em.persist(productOption);

                List<Storage> storages = em.createQuery("SELECT s FROM Storage s", Storage.class).getResultList();
                if (storages != null) {
                    for (Storage s: storages) {
                        productOption.getStock().add(new Stock(s, 0));
                    }
                }

                product.getOptions().add(productOption);
                product.updatePrice();
                em.persist(product);

                return Response.ok(productOption).build();
            } else {
                return ErrorHelper.createResponse(Response.Status.BAD_REQUEST);
            }
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @PUT
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateProductOption(
            @PathParam("id") Long id,
            @PathParam("productId") Long productId,
            ProductOptionMessage productOptionMessage) {
        Product product = em.find(Product.class, productId);
        ProductOption productOption = em.find(ProductOption.class, id);

        if (product != null && productOption != null) {
            if (productOptionMessage.isValid()) {
                productOption.setEan(productOptionMessage.getEAN());
                productOption.setName(productOptionMessage.getName());
                productOption.setPrice(productOptionMessage.getPrice());
                productOption.setReference(productOptionMessage.getReference());
                em.persist(productOption);

                product.updatePrice();
                em.persist(product);

                return Response.ok(productOption).build();
            } else {
                return ErrorHelper.createResponse(Response.Status.BAD_REQUEST);
            }
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @DELETE
    @Path("/{id}")
    public Response removeProductOption() {
        return ErrorHelper.createResponse(Response.Status.NOT_IMPLEMENTED);
    }
}
