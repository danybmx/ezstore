package ezstore.filters;

import ezstore.annotations.Secured;
import ezstore.entities.structs.Role;
import ezstore.entities.User;
import ezstore.helpers.ErrorHelper;

import javax.annotation.Priority;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.lang.reflect.Method;
import java.security.Principal;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Secured
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthFilter implements ContainerRequestFilter {

    @PersistenceContext(type = PersistenceContextType.EXTENDED)
    private EntityManager em;

    @Context
    ResourceInfo resourceInfo;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // Method
        Method method = resourceInfo.getResourceMethod();

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

                Secured securedAnnotation = method.getAnnotation(Secured.class);
                Set<Role> roleSet = new HashSet<>(Arrays.asList(securedAnnotation.value()));

                if (roleSet.size() > 0) {
                    boolean hasAccess = false;
                    for (Role role : roleSet) {
                        if (user.hasRole(role)) {
                            hasAccess = true;
                        }
                    }
                    if ( ! hasAccess) {
                        requestContext.abortWith(ErrorHelper.createResponse(Response.Status.UNAUTHORIZED));
                    }
                }

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
                        return user.hasRole(Role.valueOf(role));
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
                e.printStackTrace();
                requestContext.abortWith(ErrorHelper.createResponse(Response.Status.FORBIDDEN));
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
