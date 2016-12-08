package ezstore.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.Hibernate;
import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@SQLDelete(sql = "UPDATE products SET deleted=true WHERE id=?")
@Where(clause = "deleted != true")
@NamedQuery(name = "Product.findAll", query = "SELECT p FROM Product p")
public class Product {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private String description;
    private Double price = 0.0;
    private boolean deleted = false;

    @OneToMany(targetEntity = ProductOption.class, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "productId")
    @Fetch(value = FetchMode.SUBSELECT)
    @Where(clause = "deleted != true")
    private List<ProductOption> options = new ArrayList<>();

    @OneToMany(targetEntity = ProductImage.class, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "productId")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<ProductImage> images = new ArrayList<>();

    @OneToOne(targetEntity = ProductCategory.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "categoryId")
    private ProductCategory category;

    @OneToOne(targetEntity = ProductBrand.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "brandId")
    private ProductBrand brand;

    @PrePersist
    @PreUpdate
    public void updatePrice() {
        Double lowerPrice = null;
        if (this.options != null) {
            for (ProductOption po : this.options) {
                if (lowerPrice == null || lowerPrice > po.getPrice()) {
                    lowerPrice = po.getPrice();
                }
            }
        }
        this.price = lowerPrice;
    }

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

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public List<ProductOption> getOptions() {
        return options;
    }

    public void setOptions(List<ProductOption> options) {
        this.options = options;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public void setImages(List<ProductImage> images) {
        this.images = images;
    }

    public ProductCategory getCategory() {
        return category;
    }

    public void setCategory(ProductCategory category) {
        this.category = category;
    }

    public ProductBrand getBrand() {
        return brand;
    }

    public void setBrand(ProductBrand brand) {
        this.brand = brand;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}
