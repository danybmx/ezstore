package ezstore.services;

import ezstore.auth.Role;
import ezstore.entities.User;
import ezstore.annotations.Secured;
import ezstore.helpers.AuthorizedServiceHelper;
import ezstore.helpers.ErrorHelper;
import ezstore.helpers.Validation;
import ezstore.messages.UserMessage;
import org.hibernate.Hibernate;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/users")
@Transactional
public class UsersService extends AuthorizedServiceHelper {

    @PersistenceContext(type = PersistenceContextType.EXTENDED)
    private EntityManager em;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createUser(UserMessage userMessage) {
        if (userMessage != null) {
            Validation validation = userMessage.validate();

            if (validation.isValid()) {

                User user = new User();
                user.applyMessage(userMessage);
                em.persist(user);

                return Response.ok(user).build();

            } else {
                return ErrorHelper.createResponse(validation);
            }

        }

        return ErrorHelper.createResponse(Response.Status.BAD_REQUEST);
    }

    @PUT
    @Secured
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCurrentUser(UserMessage userMessage) {
        User user = getCurrentUser();
        return updateUser(user.getId(), userMessage);
    }

    @PUT
    @Secured(Role.ADMIN)
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response updateUser(
            @PathParam("id") Long id,
            UserMessage userMessage) {

        User user = em.find(User.class, id);

        if (this.getCurrentUser().getId().equals(id) || this.getCurrentUser().hasRole(Role.ADMIN)) {
            if (user != null) {
                if (userMessage != null) {
                    Validation validation = userMessage.validate();

                    if (validation.isValid()) {

                        user.applyMessage(userMessage);
                        em.persist(user);

                        return Response.ok(user).build();

                    } else {
                        return ErrorHelper.createResponse(validation);
                    }
                }
            } else {
                return ErrorHelper.createResponse(Response.Status.NOT_FOUND);
            }

            return ErrorHelper.createResponse(Response.Status.BAD_REQUEST);

        } else {
            return ErrorHelper.createResponse(Response.Status.FORBIDDEN);
        }
    }

    @GET
    @Secured
    @Path("/me")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCurrentUser(@Context SecurityContext securityContext) {
        return Response.ok(getCurrentUser()).build();
    }
}
