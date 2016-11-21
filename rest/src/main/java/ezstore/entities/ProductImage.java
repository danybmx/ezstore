package ezstore.entities;

import javax.persistence.*;

@Entity
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private String file;

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

    public void setFile(String file) {
        this.file = file;
    }
}
