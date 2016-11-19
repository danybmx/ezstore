package ezstore.services;

import com.sun.xml.internal.ws.client.RequestContext;
import ezstore.helpers.ErrorHelper;

import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;

@Path("addresses")
public class AddressesService {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserAddresses(@HeaderParam("Authorization") String authToken) {
        if (authToken != null) {
            String token = authToken.split(": ")[1];
            return Response.ok().build();
        } else {
            return ErrorHelper.createRequest(Response.Status.FORBIDDEN);
        }
    }
}
