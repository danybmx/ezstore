package ezstore.helpers;

import ezstore.entities.User;
import org.hibernate.Hibernate;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;

public class AuthorizedServiceHelper {
    @Context
    SecurityContext securityContext;

    @PersistenceContext
    private EntityManager em;

    protected User getCurrentUser() {
        User user = em.createNamedQuery("getUserByEmail", User.class)
                .setParameter("email", securityContext.getUserPrincipal().getName())
                .getSingleResult();

        Hibernate.initialize(user.getRoles());

        return user;
    }
}
