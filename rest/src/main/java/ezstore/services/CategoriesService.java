package ezstore.services;

import ezstore.annotations.Secured;
import ezstore.auth.Role;
import ezstore.entities.Product;
import ezstore.entities.ProductCategory;
import ezstore.helpers.ErrorHelper;
import ezstore.messages.ProductCategoryMessage;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
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
        ProductCategory category = em.find(ProductCategory.class, id);
        if (category != null) {
            return Response.ok(category).build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @POST
    @Secured(Role.ADMIN)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createCategory(ProductCategoryMessage message) {
        ProductCategory category = new ProductCategory();
        category.setName(message.getName());
        category.setUrl(message.getUrl());
        category.setVisible(message.isVisible());
        em.persist(category);

        return Response.ok(category).build();
    }

    @PUT
    @Path("/{id}")
    @Secured(Role.ADMIN)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCategory(@PathParam("id") Long id, ProductCategoryMessage message) {
        ProductCategory category = em.find(ProductCategory.class, id);
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
    public Response deleteCategory(@PathParam("id") Long id) {
        ProductCategory productCategory = em.find(ProductCategory.class, id);

        if (productCategory != null) {
            List<Product> products = em.createQuery("SELECT p FROM Product p WHERE category=:category", Product.class)
                    .setParameter("category", productCategory)
                    .getResultList();

            for (Product product : products) {
                product.setCategory(null);
                em.persist(product);
            }

            em.remove(productCategory);
            return Response.ok().build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

}