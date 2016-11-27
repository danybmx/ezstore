package ezstore.services;

import ezstore.entities.ProductBrand;
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
public class BrandsService {

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
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createBrand(ProductBrandMessage brandMessage) {
        ProductBrand brand = new ProductBrand(brandMessage.getName(), brandMessage.getURL());
        em.persist(brand);

        return Response.ok(brand).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateBrand(@PathParam("id") Long id, ProductBrandMessage brandMessage) {
        ProductBrand target = em.find(ProductBrand.class, id);
        if (target != null) {
            target.setName(brandMessage.getName());
            target.setURL(brandMessage.getURL());
            return Response.ok(target).build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    public Response deleteBrand(@PathParam("id") Long id) {
        ProductBrand productBrand = em.find(ProductBrand.class, id);

        if (productBrand != null) {
            em.remove(productBrand);
            return Response.ok().build();

        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

}