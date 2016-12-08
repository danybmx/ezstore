package ezstore;

import ezstore.helpers.ErrorHelper;

import javax.transaction.RollbackException;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class ExceptionManager implements ExceptionMapper<RollbackException> {
    @Override
    public Response toResponse(RollbackException exception) {
        return ErrorHelper.createResponse(exception);
    }
}
