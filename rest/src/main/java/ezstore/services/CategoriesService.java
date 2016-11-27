package ezstore.services;

import ezstore.entities.ProductCategory;
import ezstore.helpers.ErrorHelper;
import ezstore.messages.ProductCategoryMessage;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/categories")
@Transactional
public class CategoriesService {

    @PersistenceContext
    private EntityManager em;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<ProductCategory> getCategories() {
        return em.createQuery("SELECT r FROM ProductCategory r", ProductCategory.class).getResultList();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCategory(@PathParam("id") Long id) {
        ProductCategory brand = em.find(ProductCategory.class, id);
        if (brand != null) {
            return Response.ok(brand).build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createCategory(ProductCategoryMessage brandMessage) {
        ProductCategory brand = new ProductCategory(brandMessage.getName(), brandMessage.getURL());
        em.persist(brand);

        return Response.ok(brand).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCategory(@PathParam("id") Long id, ProductCategoryMessage brandMessage) {
        ProductCategory target = em.find(ProductCategory.class, id);
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
    public Response deleteCategory(@PathParam("id") Long id) {
        ProductCategory productCategory = em.find(ProductCategory.class, id);

        if (productCategory != null) {
            em.remove(productCategory);
            return Response.ok().build();

        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

}