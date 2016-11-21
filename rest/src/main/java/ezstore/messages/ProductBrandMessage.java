package ezstore.messages;

import ezstore.helpers.Validation;

public class ProductBrandMessage implements Message {
    private String name;
    private String URL;

    public ProductBrandMessage() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getURL() {
        return URL;
    }

    public void setURL(String URL) {
        this.URL = URL;
    }

    @Override
    public Validation validate() {
        Validation validation = new Validation();

        if (name == null || name.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("name", "Name cannot be empty");
        }
        if (URL == null || URL.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("URL", "URL cannot be empty");
        }

        return validation;
    }

}
