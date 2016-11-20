package ezstore.services;

import ezstore.annotations.Secured;
import ezstore.auth.PasswordHelper;
import ezstore.entities.User;
import ezstore.helpers.ErrorHelper;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.*;
import java.util.Base64;
import java.util.logging.Logger;

@Path("/auth")
@Transactional
public class AuthService {
    private Logger logger = Logger.getLogger("AUTH_SERVICE");

    @PersistenceContext
    private EntityManager em;

    @GET
    @Secured
    @Path("/check")
    public Response checkToken(@Context SecurityContext securityContext) {
        return Response.ok("Logged in as: " + securityContext.getUserPrincipal().getName()).build();
    }

    @GET
    public Response authenticateUser(@Context HttpHeaders headers) {
        // Get authentication header
        String authenticationHeader = headers.getHeaderString("Authorization");

        if (authenticationHeader != null) {
            // Get authentication basic data base64 encoded
            String basicAuthBase64 = authenticationHeader.substring("Basic".length()).trim();

            // Decode authentication basic data
            try {
                String basicAuth = new String(Base64.getDecoder().decode(basicAuthBase64), "UTF-8");

                String email = basicAuth.split(":")[0];
                String password = basicAuth.split(":")[1];

                User user = em
                        .createQuery("SELECT u FROM User u WHERE u.email=:email", User.class)
                        .setParameter("email", email)
                        .getSingleResult();

                if (user == null) {
                    logger.info("User " + email + " not found");
                    return ErrorHelper.createResponse(Response.Status.FORBIDDEN, "User not found");
                }

                if (!PasswordHelper.check(password, user.getPassword())) {
                    logger.info("Wrong password logging in " + email);
                    return ErrorHelper.createResponse(Response.Status.FORBIDDEN, "Wrong password");
                }

                // Create a new connection token
                logger.info("User logged " + email + " in");
                user.setToken(PasswordHelper.getConnectionToken());
                em.persist(user);

                return Response.ok("{\"token\": \"" + user.getToken() + "\"}", MediaType.APPLICATION_JSON).build();
            } catch (Exception e) {
                logger.severe(e.getMessage());
                return ErrorHelper.createResponse(Response.Status.BAD_REQUEST);
            }
        }
        return ErrorHelper.createResponse(Response.Status.BAD_REQUEST);
    }

}
