package ezstore.messages;

import ezstore.helpers.Validation;

import java.util.List;

public class ProductOptionMessage implements Message {
    private String name;
    private String ean;
    private Double price;
    private Double discount;
    private String reference;
    private int position;
    private List<Long> imagesIds;

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

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public String getEan() {
        return ean;
    }

    public void setEan(String ean) {
        this.ean = ean;
    }

    public List<Long> getImagesIds() {
        return imagesIds;
    }

    public void setImagesIds(List<Long> imagesIds) {
        this.imagesIds = imagesIds;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    @Override
    public Validation validate() {
        Validation validation = new Validation();

        if (name == null || name.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("name", "Name cannot be empty");
        }
        if (price == null || !(price > 0)) {
            validation.setValid(false);
            validation.getReasons().put("price", "Price should be higher than 0");
        }

        /*
        if (ean == null || ean.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("ean", "ean cannot be empty");
        }
        if (reference == null || reference.length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("reference", "Reference cannot be empty");
        }
        */

        return validation;
    }
}
