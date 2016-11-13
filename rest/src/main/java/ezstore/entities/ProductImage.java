package ezstore.entities;

import javax.persistence.*;

@Entity
@Table(name = "products_images")
public class ProductImage {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private String file;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "productId")
    private Product product;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "optionId")
    private ProductOption option;

    public ProductImage() {
    }

    public ProductImage(String name, String file) {
        this.name = name;
        this.file = file;
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

    public String getFile() {
        return file;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public ProductOption getOption() {
        return option;
    }

    public void setOption(ProductOption option) {
        this.option = option;
    }

    public void setFile(String file) {
        this.file = file;
    }
}
