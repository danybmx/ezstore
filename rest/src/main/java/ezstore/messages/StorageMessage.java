package ezstore.messages;

import ezstore.helpers.Validation;

public class StorageMessage implements Message {
    private String name;

    public StorageMessage() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public Validation validate() {
        Validation validation = new Validation();

        if (name == null || name.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("name", "Name cannot be empty");
        }

        return validation;
    }
}
