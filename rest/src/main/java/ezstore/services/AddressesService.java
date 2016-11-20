package ezstore.services;

import ezstore.annotations.Secured;
import ezstore.entities.Address;
import ezstore.helpers.ErrorHelper;
import ezstore.messages.AddressMessage;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

@Path("addresses")
@Secured
public class AddressesService {

    @Context
    private SecurityContext securityContext;

    @PersistenceContext
    private EntityManager em;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserAddresses() {
        return ErrorHelper.createResponse(Response.Status.NOT_IMPLEMENTED);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createProduct(AddressMessage message) {

        if (message.isValid()) {

            Address address = new Address();
            address.setName(message.getName());
            address.setLine1(message.getLine1());
            address.setLine2(message.getLine2());
            address.setLine3(message.getLine3());
            address.setCity(message.getCity());
            address.setState(message.getState());
            address.setCountry(message.getCountry());
            address.setPostalCode(message.getPostalCode());
            em.persist(address);

            return Response.ok(address).build();

        }

        return ErrorHelper.createResponse(Response.Status.BAD_REQUEST);

    }


}
