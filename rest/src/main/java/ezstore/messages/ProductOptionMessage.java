package ezstore.messages;

import ezstore.helpers.Validation;

public class ProductOptionMessage implements Message {
    private String name;
    private String EAN;
    private Double price;
    private String reference;

    public boolean isValid() {
        boolean valid = true;

        if (this.name == null || this.name.length() < 1) { valid = false; }
        if (this.price == null || !(this.price > 0)) { valid = false; }

        return valid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEAN() {
        return EAN;
    }

    public void setEAN(String EAN) {
        this.EAN = EAN;
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

    @Override
    public Validation validate() {
        Validation validation = new Validation();

        if (name == null || name.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("name", "Name cannot be empty");
        }
        if (EAN == null || EAN.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("EAN", "EAN cannot be empty");
        }
        if (reference == null || reference.length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("reference", "Reference cannot be empty");
        }
        if (price == null || !(price > 0)) {
            validation.setValid(false);
            validation.getReasons().put("price", "Price should be higher than 0");
        }

        return validation;
    }
}
