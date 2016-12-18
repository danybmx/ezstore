package ezstore.services;

import ezstore.annotations.Secured;
import ezstore.entities.structs.Role;
import ezstore.entities.Product;
import ezstore.entities.ProductBrand;
import ezstore.entities.ProductCategory;
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
    @Path("/featured")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Product> getFeaturedProducts() {
        return em.createQuery("SELECT r FROM Product r WHERE r.featured = true", Product.class).getResultList();
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
    @Secured(Role.ADMIN)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createProduct(ProductMessage productMessage) {

        if (productMessage.validate().isValid()) {

            Product product = new Product();
            product.setName(productMessage.getName());
            product.setSlug(productMessage.getSlug());
            product.setDescription(productMessage.getDescription());
            product.setBrand(em.find(ProductBrand.class, productMessage.getBrandId()));
            product.setCategory(em.find(ProductCategory.class, productMessage.getCategoryId()));
            product.setFeatured(productMessage.isFeatured());
            em.persist(product);

            return Response.ok(product).build();

        }

        return ErrorHelper.createResponse(Response.Status.BAD_REQUEST);

    }

    @PUT
    @Path("/{id}")
    @Secured(Role.ADMIN)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateProduct(@PathParam("id") Long id, ProductMessage productMessage) {
        Product product = em.find(Product.class, id);

        if (product != null) {
            product.setName(productMessage.getName());
            product.setSlug(productMessage.getSlug());
            product.setDescription(productMessage.getDescription());
            product.setBrand(em.find(ProductBrand.class, productMessage.getBrandId()));
            product.setCategory(em.find(ProductCategory.class, productMessage.getCategoryId()));
            product.setFeatured(productMessage.isFeatured());
            em.merge(product);
            return Response.ok(product).build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @DELETE
    @Path("/{id}")
    @Secured(Role.ADMIN)
    @Produces(MediaType.TEXT_PLAIN)
    public Response deleteProduct(@PathParam("id") Long id) {
        Product product = em.find(Product.class, id);

        if (product != null) {
            em.remove(product);
            return Response.ok().build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

}
