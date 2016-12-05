package ezstore.services;

import ezstore.auth.PasswordHelper;
import ezstore.entities.User;
import ezstore.annotations.Secured;
import ezstore.helpers.ErrorHelper;
import ezstore.helpers.Validation;
import ezstore.messages.UserMessage;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;
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

        if (userMessage != null) {
            Validation validation = userMessage.validate();

            if (validation.isValid()) {

                User user = new User();
                user.setEmail(userMessage.getEmail());
                user.setPassword(PasswordHelper.getSaltedHash(userMessage.getPassword()));
                em.persist(user);

                return Response.ok(user).build();

            } else {
                return ErrorHelper.createResponse(validation);
            }

        }

        return ErrorHelper.createResponse(Response.Status.BAD_REQUEST);

    }

    @GET
    @Secured
    @Path("/me")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCurrentUser(@Context SecurityContext securityContext) {
      User user = em
              .createQuery("SELECT u FROM User u WHERE u.email=:email", User.class)
              .setParameter("email", securityContext.getUserPrincipal().getName())
              .getSingleResult();

      return Response.ok(user).build();
    }
}
