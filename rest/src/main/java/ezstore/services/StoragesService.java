package ezstore.services;

import ezstore.entities.Product;
import ezstore.entities.ProductOption;
import ezstore.entities.Stock;
import ezstore.entities.Storage;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/storages")
@Transactional
public class StoragesService {

    @PersistenceContext
    private EntityManager em;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Storage> getStorages() {
        return em.createQuery("SELECT r FROM Storage r", Storage.class).getResultList();
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
    public Storage createStorage(Storage storage) {
        em.persist(storage);

        List<ProductOption> options = em.createQuery("SELECT o FROM ProductOption o", ProductOption.class).getResultList();
        for (ProductOption option : options) {
            Stock stock = new Stock(storage, 0);
            option.getStock().add(stock);
            em.persist(option);
        }

        return storage;
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