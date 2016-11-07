package ezstore.entities;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "products")
@NamedQuery(name = "Product.findAll", query = "SELECT p FROM Product p")
public class Product {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private String description;
    private String price;

    @OneToMany(targetEntity = ProductOption.class, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "productId")
    private List<ProductOption> options;

    public Product() {
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public List<ProductOption> getOptions() {
        return options;
    }

    public void setOptions(List<ProductOption> options) {
        this.options = options;
    }
}
