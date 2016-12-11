package ezstore.services;

import ezstore.annotations.Secured;
import ezstore.auth.Role;
import ezstore.entities.Address;
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
    public Response getUserAddresses() {
        return Response.ok(getCurrentUser().getAddresses()).build();
    }

    @POST
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createAddress(AddressMessage message) {

        Validation validation = message.validate();

        if (validation.isValid()) {

            Address address = new Address(message);
            em.persist(address);

            getCurrentUser().getAddresses().add(address);

            return Response.ok(address).build();

        }

        return ErrorHelper.createResponse(validation);
    }

    @PUT
    @Secured
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateAddress(@PathParam("id") Long id, AddressMessage message) {
        Address address = em.find(Address.class, id);

        if (address != null && getCurrentUser().getAddresses().contains(address)) {
            address.applyMessage(message);
            em.persist(address);
            return Response.ok(address).build();
        }

        return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
    }


}
