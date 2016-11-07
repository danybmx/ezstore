package ezstore.services;

import ezstore.entities.Storage;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/storages")
@Transactional
public class StorageService {

    @PersistenceContext
    private EntityManager em;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Storage> getStorages() {
        return (List<Storage>) em.createQuery("SELECT r FROM Storage r").getResultList();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Storage getStorage(@PathParam("id") Long id) {
        Storage product = em.find(Storage.class, id);
        if (product != null) {
            return product;
        }

        throw new NotFoundException();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Storage createStorage(Storage product) {
        em.persist(product);
        return product;
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Storage updateStorage(@PathParam("id") Long id, Storage product) {
        Storage target = em.find(Storage.class, id);

        if (target != null) {
            product.setId(id);
            em.merge(product);
            return product;
        }

        throw new NotFoundException();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    public String deleteStorage(@PathParam("id") Long id) {
        Storage product = em.find(Storage.class, id);

        if (product != null) {
            em.remove(product);
            return "OK";
        }

        throw new NotFoundException();
    }

}