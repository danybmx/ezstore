package ezstore.messages;

public class ProductMessage {
    private String name;
    private String description;

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

    public boolean isValid() {
        boolean valid = true;

        if (this.name == null || this.name.length() < 1) { valid = false; }
        if (this.description == null || this.description.length() < 1) { valid = false; }

        return valid;
    }
}
