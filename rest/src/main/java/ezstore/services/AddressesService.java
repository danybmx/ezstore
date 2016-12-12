package ezstore.services;

import ezstore.annotations.Secured;
import ezstore.auth.Role;
import ezstore.entities.Address;
import ezstore.entities.User;
import ezstore.helpers.AuthorizedServiceHelper;
import ezstore.helpers.ErrorHelper;
import ezstore.messages.AddressMessage;
import ezstore.helpers.Validation;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.List;

@Secured
@Transactional
@Path("addresses")
public class AddressesService extends AuthorizedServiceHelper {

    @Context
    private SecurityContext securityContext;

    @PersistenceContext
    private EntityManager em;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCurrentUserAddresses() {
        return Response.ok(getCurrentUser().getAddresses()).build();
    }

    @POST
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createCurrentUserAddress(AddressMessage message) {

        Validation validation = message.validate();
        User user = getCurrentUser();

        if (validation.isValid()) {

            Address address = new Address(message);
            em.persist(address);

            user.getAddresses().add(address);
            if (user.getDefaultBillingAddress() == null) {
                user.setDefaultBillingAddress(address);
            }
            if (user.getDefaultShippingAddress() == null) {
                user.setDefaultShippingAddress(address);
            }

            return Response.ok(address).build();

        }

        return ErrorHelper.createResponse(validation);
    }

    @PUT
    @Secured
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCurrentUserAddress(@PathParam("id") Long id, AddressMessage message) {
        Address address = em.find(Address.class, id);

        if (address != null && getCurrentUser().getAddresses().contains(address)) {
            address.applyMessage(message);
            em.persist(address);
            return Response.ok(address).build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @DELETE
    @Secured
    @Path("/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    public Response deleteCurrentUserAddress(@PathParam("id") Long id, AddressMessage message) {
        User user = getCurrentUser();
        Address address = em.find(Address.class, id);

        if (address != null && user.getAddresses().contains(address)) {
            if (user.getDefaultShippingAddress() == address) {
                user.setDefaultShippingAddress(null);
            }

            if (user.getDefaultBillingAddress() == address) {
                user.setDefaultBillingAddress(null);
            }

            em.persist(user);

            em.remove(address);
            return Response.ok().build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @POST
    @Path("/{userId}")
    @Secured(Role.ADMIN)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUserAddress(@PathParam("userId") Long userId, AddressMessage message) {

        Validation validation = message.validate();
        User user = em.find(User.class, userId);

        if (validation.isValid()) {

            Address address = new Address(message);
            em.persist(address);
            user.getAddresses().add(address);

            if (user.getDefaultBillingAddress() == null) {
                user.setDefaultBillingAddress(address);
            }
            if (user.getDefaultShippingAddress() == null) {
                user.setDefaultShippingAddress(address);
            }
            em.persist(user);

            return Response.ok(address).build();

        }

        return ErrorHelper.createResponse(validation);
    }

    @PUT
    @Secured
    @Path("/{userId}/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUserAddress(@PathParam("userId") Long userId, @PathParam("id") Long id, AddressMessage message) {
        Address address = em.find(Address.class, id);
        User user = em.find(User.class, userId);

        if (address != null && user != null && user.getAddresses().contains(address)) {
            address.applyMessage(message);
            em.persist(address);
            return Response.ok(address).build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }

    @DELETE
    @Secured
    @Path("/{userId}/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    public Response deleteUserAddress(@PathParam("userId") Long userId, @PathParam("id") Long id, AddressMessage message) {
        Address address = em.find(Address.class, id);
        User user = em.find(User.class, userId);

        if (address != null && user != null && user.getAddresses().contains(address)) {

            if (user.getDefaultShippingAddress() == address) {
                user.setDefaultShippingAddress(null);
            }

            if (user.getDefaultBillingAddress() == address) {
                user.setDefaultBillingAddress(null);
            }

            em.persist(user);
            em.remove(address);
            return Response.ok().build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }
}
