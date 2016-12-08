package ezstore.helpers;

import javax.servlet.jsp.tagext.ValidationMessage;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

public abstract class ErrorHelper {
    public static Response createResponse(Response.Status status) {
        return Response.status(status).entity("{\"message\": \"" + status.getReasonPhrase() + "\"}").build();
    }

    public static Response createResponse(Response.Status status, String message) {
        return Response.status(status).entity("{\"message\": \"" + message + "\"}").build();
    }

    public static Response createResponse(Exception exception) {
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("{\"message\": \"" + exception.getMessage() + "\"}").build();
    }

    public static Response createResponse(Validation validation) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity(validation)
                .type(MediaType.APPLICATION_JSON)
                .build();
    }
}
