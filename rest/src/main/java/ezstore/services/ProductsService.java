package ezstore.services;

import ezstore.entities.Product;
import ezstore.helpers.ErrorHelper;
import ezstore.messages.ProductMessage;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/products")
@Transactional
public class ProductsService {

    @PersistenceContext
    private EntityManager em;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getProducts() {
        return em.createQuery("SELECT r FROM Product r", Product.class).getResultList();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Product getProduct(@PathParam("id") Long id) {
        Product product = em.find(Product.class, id);
        if (product != null) {
            return product;
        }

        throw new NotFoundException();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createProduct(ProductMessage productMessage) {

        if (productMessage.isValid()) {

            Product product = new Product();
            product.setName(productMessage.getName());
            product.setDescription(productMessage.getDescription());
            em.persist(product);

            return Response.ok(product).build();

        }

        return ErrorHelper.createRequest(Response.Status.BAD_REQUEST);

    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Product updateProduct(@PathParam("id") Long id, ProductMessage productMessage) {
        Product product = em.find(Product.class, id);

        if (product != null) {
            product.setName(productMessage.getName());
            product.setDescription(productMessage.getDescription());
            em.merge(product);
            return product;
        }

        throw new NotFoundException();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    public String deleteProduct(@PathParam("id") Long id) {
        Product product = em.find(Product.class, id);

        if (product != null) {
            em.remove(product);
            return "OK";
        }

        throw new NotFoundException();
    }

}
