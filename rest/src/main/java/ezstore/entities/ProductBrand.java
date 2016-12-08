package ezstore.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "product_brands")
public class ProductBrand {

    @Id
    @GeneratedValue
    private Long id;

    private String url;
    private String name;
    private boolean visible;

    public ProductBrand() {
    }

    public ProductBrand(String key, String name) {
        this.url = key;
        this.name = name;
        this.visible = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }
}
