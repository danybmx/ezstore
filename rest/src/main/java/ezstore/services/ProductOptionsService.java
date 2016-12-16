package ezstore.services;

import ezstore.annotations.Secured;
import ezstore.entities.structs.Role;
import ezstore.entities.*;
import ezstore.helpers.ErrorHelper;
import ezstore.helpers.Validation;
import ezstore.messages.ProductOptionMessage;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
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
    @Secured(Role.ADMIN)
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createProductOption(
            @PathParam("productId") Long productId,
            ProductOptionMessage productOptionMessage) {
        Product product = em.find(Product.class, productId);

        if (product != null) {
            Validation validation = productOptionMessage.validate();
            if (validation.isValid()) {
                ProductOption productOption = new ProductOption();
                productOption.setName(productOptionMessage.getName());
                productOption.setPrice(productOptionMessage.getPrice());
                productOption.setEan(productOptionMessage.getEan());
                productOption.setReference(productOptionMessage.getReference());

                List<ProductImage> productImages = new ArrayList<>();
                if (productOptionMessage.getImagesIds().size() > 0) {
                    for (Long imageId : productOptionMessage.getImagesIds()) {
                        ProductImage productImage = em.find(ProductImage.class, imageId);
                        productImages.add(productImage);
                    }
                }
                productOption.setImages(productImages);

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
                return ErrorHelper.createResponse(productOptionMessage.validate());
            }
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @PUT
    @Path("/{id}")
    @Secured(Role.ADMIN)
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateProductOption(
            @PathParam("id") Long id,
            @PathParam("productId") Long productId,
            ProductOptionMessage productOptionMessage) {
        Product product = em.find(Product.class, productId);
        ProductOption productOption = em.find(ProductOption.class, id);

        if (product != null && productOption != null) {
            Validation validation = productOptionMessage.validate();
            if (validation.isValid()) {
                productOption.setEan(productOptionMessage.getEan());
                productOption.setName(productOptionMessage.getName());
                productOption.setPrice(productOptionMessage.getPrice());
                productOption.setReference(productOptionMessage.getReference());

                List<ProductImage> productImages = new ArrayList<>();
                if (productOptionMessage.getImagesIds().size() > 0) {
                    for (Long imageId : productOptionMessage.getImagesIds()) {
                        ProductImage productImage = em.find(ProductImage.class, imageId);
                        productImages.add(productImage);
                    }
                }
                productOption.setImages(productImages);

                em.persist(productOption);

                product.updatePrice();
                em.persist(product);

                return Response.ok(productOption).build();
            } else {
                return ErrorHelper.createResponse(validation);
            }
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @DELETE
    @Path("/{id}")
    @Secured(Role.ADMIN)
    public Response removeProductOption(@PathParam("id") Long id) {
        ProductOption option = em.find(ProductOption.class, id);

        if (option != null) {
            em.remove(option);
            return Response.ok().build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }
}
