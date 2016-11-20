package ezstore.helpers;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public abstract class ErrorHelper {
    public static Response createResponse(Response.Status status) {
        return Response.status(status).entity("{\"error\": \"" + status.getReasonPhrase() + "\"}").build();
    }

    public static Response createResponse(Response.Status status, String message) {
        return Response.status(status).entity("{\"error\": \"" + message + "\"}").build();
    }
}
