package ezstore.messages;

import ezstore.helpers.Validation;

public class ProductMessage implements Message {
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

        return validation;
    }
}
