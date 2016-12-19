package ezstore.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import ezstore.Config;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@SQLDelete(sql = "UPDATE products SET deleted=true WHERE id=?")
@Where(clause = "deleted != true")
@NamedQuery(name = "Product.findAll", query = "SELECT p FROM Product p")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Product {
    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;
    private Double price = 0.0;
    private boolean featured = false;
    private boolean deleted;
    private String slug;

    @OneToMany(targetEntity = ProductOption.class, fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "productId")
    @Fetch(value = FetchMode.SUBSELECT)
    @Where(clause = "deleted != true")
    @OrderBy("position")
    private List<ProductOption> options = new ArrayList<>();

    @OneToMany(targetEntity = ProductImage.class, fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "productId")
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("position")
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

    public Double getPriceTaxIncluded() {
        return price * (100 + Config.TAX) / 100;
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

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}
