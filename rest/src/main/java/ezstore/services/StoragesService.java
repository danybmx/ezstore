package ezstore.services;

import ezstore.entities.Product;
import ezstore.entities.ProductOption;
import ezstore.entities.Stock;
import ezstore.entities.Storage;
import ezstore.helpers.ErrorHelper;
import ezstore.helpers.Validation;
import ezstore.messages.StorageMessage;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
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
    public Response createStorage(StorageMessage message) {
        Validation validation = message.validate();

        if (validation.isValid()) {
            Storage storage = new Storage();
            storage.setName(message.getName());
            storage.setPhone(message.getPhone());
            storage.setAddress(message.getAddress());

            em.persist(storage);

            List<ProductOption> options = em.createQuery("SELECT o FROM ProductOption o", ProductOption.class).getResultList();
            for (ProductOption option : options) {
                Stock stock = new Stock(storage, 0);
                option.getStock().add(stock);
                em.persist(option);
            }

            return Response.ok().entity(storage).build();
        } else {
            return ErrorHelper.createResponse(validation);
        }
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateStorage(@PathParam("id") Long id, StorageMessage message) {
        Storage storage = em.find(Storage.class, id);

        if (storage != null) {
            storage.setName(message.getName());
            storage.setPhone(message.getPhone());
            storage.setAddress(message.getAddress());
            em.merge(storage);

            return Response.ok().entity(storage).build();
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