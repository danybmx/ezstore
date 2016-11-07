package ezstore.entities;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "products_options")
public class ProductOption {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private Double price;

    @OneToMany(targetEntity = Stock.class, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "optionId")
    private List<Stock> stock;

    public ProductOption() {
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

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public List<Stock> getStock() {
        return stock;
    }

    public void setStock(List<Stock> stock) {
        this.stock = stock;
    }
}
