package ezstore.entities;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "products_options")
public class ProductOption {

    @Id
    @GeneratedValue
    private Long id;

    private String EAN;
    private String reference;
    private String name;
    private Double price;

    @OneToMany(targetEntity = Stock.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "optionId")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Stock> stock;

    @OneToMany(targetEntity = ProductImage.class, fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "optionId")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<ProductImage> images;

    public ProductOption() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEAN() {
        return EAN;
    }

    public void setEAN(String EAN) {
        this.EAN = EAN;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
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

    public List<ProductImage> getImages() {
        return images;
    }

    public void setImages(List<ProductImage> images) {
        this.images = images;
    }

}
