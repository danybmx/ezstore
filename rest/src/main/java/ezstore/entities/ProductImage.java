package ezstore.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue
    private Long id;
    private int position;
    private String file;

    @ManyToMany(mappedBy = "images", targetEntity = ProductOption.class, cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<ProductOption> options;

    public ProductImage() {
    }

    public ProductImage(String name, String file) {
        this.file = file;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public List<ProductOption> getOptions() {
        return options;
    }

    public void setOptions(List<ProductOption> options) {
        this.options = options;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }
}
