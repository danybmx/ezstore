package ezstore.messages;

public class ProductOptionMessage {
    private String name;
    private String EAN;
    private Double price;
    private String reference;

    public boolean isValid() {
        boolean valid = true;

        if (this.name == null || this.name.length() < 1) { valid = false; }
        if (this.EAN == null || this.EAN.length() < 1) { valid = false; }
        if (this.reference == null || this.reference.length() < 1) { valid = false; }
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
}
