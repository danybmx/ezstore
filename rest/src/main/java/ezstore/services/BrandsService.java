package ezstore.services;

import ezstore.annotations.Secured;
import ezstore.auth.Role;
import ezstore.entities.Product;
import ezstore.entities.ProductBrand;
import ezstore.helpers.AuthorizedServiceHelper;
import ezstore.helpers.ErrorHelper;
import ezstore.messages.ProductBrandMessage;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/brands")
@Transactional
public class BrandsService extends AuthorizedServiceHelper {

    @PersistenceContext
    private EntityManager em;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<ProductBrand> getBrands() {
        return em.createQuery("SELECT r FROM ProductBrand r", ProductBrand.class).getResultList();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getBrand(@PathParam("id") Long id) {
        ProductBrand brand = em.find(ProductBrand.class, id);
        if (brand != null) {
            return Response.ok(brand).build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @POST
    @Secured(Role.ADMIN)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createBrand(ProductBrandMessage message) {
        ProductBrand brand = new ProductBrand();
        brand.setName(message.getName());
        brand.setUrl(message.getUrl());
        brand.setVisible(message.isVisible());
        em.persist(brand);

        return Response.ok(brand).build();
    }

    @PUT
    @Path("/{id}")
    @Secured(Role.ADMIN)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateBrand(@PathParam("id") Long id, ProductBrandMessage message) {
        ProductBrand category = em.find(ProductBrand.class, id);
        if (category != null) {
            category.setName(message.getName());
            category.setUrl(message.getUrl());
            category.setVisible(message.isVisible());
            return Response.ok(category).build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @DELETE
    @Path("/{id}")
    @Secured(Role.ADMIN)
    @Produces(MediaType.TEXT_PLAIN)
    public Response deleteBrand(@PathParam("id") Long id) {
        ProductBrand productBrand = em.find(ProductBrand.class, id);

        if (productBrand != null) {
            List<Product> products = em.createQuery("SELECT p FROM Product p WHERE brand=:brand", Product.class)
                    .setParameter("brand", productBrand)
                    .getResultList();

            for (Product product : products) {
                product.setCategory(null);
                em.persist(product);
            }

            em.remove(productBrand);
            return Response.ok().build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

}