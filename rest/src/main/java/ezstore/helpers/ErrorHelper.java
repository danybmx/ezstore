package ezstore.helpers;

import ezstore.exceptions.NoStockException;
import ezstore.messages.ExceptionMessage;

import javax.servlet.jsp.tagext.ValidationMessage;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public abstract class ErrorHelper {
    public static Response createResponse(Response.Status status) {
        return Response.status(status).entity("{\"message\": \"" + status.getReasonPhrase() + "\"}").build();
    }

    public static Response createResponse(Response.Status status, String message) {
        return Response.status(status).entity("{\"message\": \"" + message + "\"}").build();
    }

    public static Response createResponse(Exception exception) {

        Method getDetailsMethod = null;
        Method[] methods = exception.getClass().getMethods();
        for (Method m : methods) {
            if (m.getName().equals("getDetails")) {
                getDetailsMethod = m;
                break;
            }
        }

        ExceptionMessage exceptionMessage = null;
        try {
            exceptionMessage = new ExceptionMessage(
                    exception.getClass().getSimpleName(),
                    exception.getMessage(),
                    getDetailsMethod != null ? getDetailsMethod.invoke(exception) : ""
            );
        } catch (IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(exceptionMessage).build();
    }

    public static Response createResponse(Validation validation) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity(validation)
                .type(MediaType.APPLICATION_JSON)
                .build();
    }
}
