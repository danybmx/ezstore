package ezstore.messages;

import ezstore.helpers.SlugGenerator;
import ezstore.helpers.Validation;

public class ProductMessage implements Message {
    private String name;
    private String description;
    private boolean featured;
    private Long brandId;
    private Long categoryId;

    public ProductMessage() {
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

    public Long getBrandId() {
        return brandId;
    }

    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public String getSlug() {
        return SlugGenerator.toSlug(this.name);
    }

    @Override
    public Validation validate() {
        Validation validation = new Validation();

        if (name == null || name.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("name", "Name cannot be empty");
        }
        if (description == null || description.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("description", "Description cannot be empty");
        }
        if (brandId == null || brandId == 0) {
            validation.setValid(false);
            validation.getReasons().put("brand", "Brand cannot be empty");
        }
        if (categoryId == null || categoryId == 0) {
            validation.setValid(false);
            validation.getReasons().put("category", "Category cannot be empty");
        }

        return validation;
    }
}
