package ezstore.messages;

import ezstore.helpers.Validation;

public class ProductOptionMessage implements Message {
    private String name;
    private String ean;
    private Double price;
    private Double discount;
    private String reference;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEAN() {
        return ean;
    }

    public void setEAN(String ean) {
        this.ean = ean;
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
