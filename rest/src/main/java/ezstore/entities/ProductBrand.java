package ezstore.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "products_brands")
public class ProductBrand {

    @Id
    @GeneratedValue
    private Long id;

    private String key;
    private String name;

    public ProductBrand() {
    }

    public ProductBrand(String key, String name) {
        this.key = key;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
