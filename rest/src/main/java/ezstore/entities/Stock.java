package ezstore.entities;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stock")
public class Stock {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "storageId")
    private Storage storage;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "optionId")
    private ProductOption option;

    private int units;

    public Stock(Storage storage, int units) {
        this.storage = storage;
        this.units = units;
    }

    public Stock() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Storage getStorage() {
        return storage;
    }

    public void setStorage(Storage storage) {
        this.storage = storage;
    }

    public int getUnits() {
        return units;
    }

    public void setUnits(int units) {
        this.units = units;
    }
}
