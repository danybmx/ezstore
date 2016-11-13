package ezstore.services;

import ezstore.entities.Product;
import ezstore.entities.ProductOption;
import ezstore.helpers.ErrorHelper;
import ezstore.messages.ProductOptionMessage;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

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

        return ErrorHelper.createRequest(Response.Status.NOT_FOUND);
    }

    @POST
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createProductOption(@PathParam("productId") Long productId, ProductOptionMessage productOptionMessage) {
        Product product = em.find(Product.class, productId);

        if (product != null) {
            if (productOptionMessage.isValid()) {
                ProductOption productOption = new ProductOption();
                productOption.setName(productOptionMessage.getName());
                productOption.setPrice(productOptionMessage.getPrice());
                productOption.setEAN(productOptionMessage.getEAN());
                em.persist(productOption);

                return Response.ok(product).build();
            }
        }

        return ErrorHelper.createRequest(Response.Status.NOT_FOUND);
    }
}
