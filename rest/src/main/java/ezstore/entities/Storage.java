package ezstore.entities;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "storages")
public class Storage {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    public Storage() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
