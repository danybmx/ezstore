package ezstore.services;

import ezstore.auth.AuthHelper;
import ezstore.entities.User;
import ezstore.helpers.ErrorHelper;
import ezstore.messages.UserMessage;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/users")
@Transactional
public class UsersService {

    @PersistenceContext
    private EntityManager em;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(UserMessage userMessage) {

        if (userMessage.isValid()) {

            User user = new User();
            user.setEmail(userMessage.getEmail());
            user.setPassword(AuthHelper.getSaltedHash(userMessage.getPassword()));
            em.persist(user);

            return Response.ok(user).build();

        }

        return ErrorHelper.createResponse(Response.Status.BAD_REQUEST);

    }


}
