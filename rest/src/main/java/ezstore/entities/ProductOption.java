package ezstore.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import ezstore.Config;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_options")
@SQLDelete(sql = "UPDATE product_options SET deleted=true WHERE id=?")
@Where(clause = "deleted != true")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductOption {

    @Id
    @GeneratedValue
    private Long id;

    private String ean;
    private String reference;
    private String name;
    private Double price;
    private int discount;
    private boolean deleted;
    private int position;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "productId")
    private Product product;

    @OneToMany(targetEntity = Stock.class, fetch = FetchType.EAGER, cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "optionId")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Stock> stock = new ArrayList<>();

    @ManyToMany(targetEntity = ProductImage.class, fetch = FetchType.EAGER)
    @JoinTable(
            name = "product_images_options",
            joinColumns = @JoinColumn(name = "optionId", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "imageId", referencedColumnName = "id"))
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("position")
    private List<ProductImage> images = new ArrayList<>();

    public ProductOption() {
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
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

    public Double getPriceTaxIncluded() {
        return price * (100 + Config.TAX) / 100;
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

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public int getAvailableStock() {
        int availableUnits = 0;
        for (Stock stock : this.getStock()) {
            if (stock.getStorage().isUseAsPrimary()) {
                availableUnits += stock.getUnits();
            }
        }
        return availableUnits;
    }
}
