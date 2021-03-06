package ezstore.services;

import ezstore.annotations.Secured;
import ezstore.entities.structs.Role;
import ezstore.entities.*;
import ezstore.helpers.ErrorHelper;
import ezstore.helpers.Validation;
import ezstore.messages.ProductImageMessage;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/products/{productId}/images")
@Transactional
public class ProductImagesService {

    @PersistenceContext(type = PersistenceContextType.EXTENDED)
    private EntityManager em;

    @GET
    @Path("/")
    @Secured(Role.ADMIN)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductImages(@PathParam("productId") Long productId) {
        Product product = em.find(Product.class, productId);

        if (product != null) {
            return Response.ok(product.getImages()).build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @POST
    @Path("/")
    @Secured(Role.ADMIN)
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createProductImage(
            @PathParam("productId") Long productId,
            ProductImageMessage productImageMessage) {
        Product product = em.find(Product.class, productId);

        if (product != null) {
            Validation validation = productImageMessage.validate();
            if (validation.isValid()) {
                ProductImage productImage = new ProductImage();
                productImage.setFile(productImageMessage.getFile());
                productImage.setPosition(productImageMessage.getPosition());
                em.persist(productImage);

                product.getImages().add(productImage);
                em.persist(product);

                return Response.ok(productImage).build();
            } else {
                return ErrorHelper.createResponse(productImageMessage.validate());
            }
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @PUT
    @Path("/{id}")
    @Secured(Role.ADMIN)
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateProductImage(
            @PathParam("id") Long id,
            @PathParam("productId") Long productId,
            ProductImageMessage productImageMessage) {
        Product product = em.find(Product.class, productId);
        ProductImage productImage = em.find(ProductImage.class, id);

        if (product != null && productImage != null) {
            Validation validation = productImageMessage.validate();

            if (validation.isValid()) {
                productImage.setFile(productImageMessage.getFile());
                productImage.setPosition(productImageMessage.getPosition());
                em.persist(productImage);

                product.getImages().add(productImage);
                em.persist(product);

                return Response.ok(productImage).build();
            } else {
                return ErrorHelper.createResponse(productImageMessage.validate());
            }
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @DELETE
    @Path("/{id}")
    @Secured(Role.ADMIN)
    public Response removeProductImage(@PathParam("id") Long id) {
        ProductImage image = em.find(ProductImage.class, id);

        if (image != null) {
            if (image.getOptions().size() > 0) {
                for (ProductOption option : image.getOptions()) {
                    option.getImages().remove(image);
                    em.persist(option);
                }
            }

            MediaService.deleteFile(image.getFile(), "products");

            em.remove(image);
            return Response.ok().build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }
}
