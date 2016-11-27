package ezstore.filters;

import ezstore.annotations.Secured;
import ezstore.entities.User;
import ezstore.helpers.ErrorHelper;

import javax.annotation.Priority;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.security.Principal;

@Secured
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthFilter implements ContainerRequestFilter {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // Get the HTTP Authorization header from the request
        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        // Check if the HTTP Authorization header is present and formatted correctly
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            requestContext.abortWith(ErrorHelper.createResponse(Response.Status.FORBIDDEN, "Authorization header must be provided"));
        } else {
            // Extract the token from the HTTP Authorization header
            String token = authorizationHeader.substring("Bearer".length()).trim();

            try {
                User user = validateToken(token);

                requestContext.setSecurityContext(new SecurityContext() {
                    @Override
                    public Principal getUserPrincipal() {
                        return new Principal() {
                            @Override
                            public String getName() {
                                return user.getEmail();
                            }
                        };
                    }

                    @Override
                    public boolean isUserInRole(String role) {
                        return true;
                    }

                    @Override
                    public boolean isSecure() {
                        return false;
                    }

                    @Override
                    public String getAuthenticationScheme() {
                        return null;
                    }
                });
            } catch (Exception e) {
                requestContext.abortWith(ErrorHelper.createResponse(Response.Status.UNAUTHORIZED));
            }
        }
    }

    private User validateToken(String token) throws Exception {
        User user = em.createQuery("SELECT u FROM User u WHERE u.token = :token", User.class)
                .setParameter("token", token)
                .getSingleResult();

        if (user == null) {
            throw new Exception("Invalid token");
        }

        return user;
    }
}
