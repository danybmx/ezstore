package ezstore.entities;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_options")
@SQLDelete(sql = "UPDATE product_options SET deleted=true WHERE id=?")
@Where(clause = "deleted != true")
public class ProductOption {

    @Id
    @GeneratedValue
    private Long id;

    private String ean;
    private String reference;
    private String name;
    private Double price;
    private int discount;
    private boolean deleted = false;

    @OneToMany(targetEntity = Stock.class, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "optionId")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Stock> stock = new ArrayList<>();

    @ManyToMany(targetEntity = ProductImage.class, fetch = FetchType.EAGER)
    @JoinTable(
            name = "product_images_options",
            joinColumns = @JoinColumn(name = "optionId", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "imageId", referencedColumnName = "id"))
    @Fetch(value = FetchMode.SUBSELECT)
    private List<ProductImage> images = new ArrayList<>();

    public ProductOption() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEan() {
        return ean;
    }

    public void setEan(String ean) {
        this.ean = ean;
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

    public int getDiscount() {
        return discount;
    }

    public void setDiscount(int discount) {
        this.discount = discount;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}
