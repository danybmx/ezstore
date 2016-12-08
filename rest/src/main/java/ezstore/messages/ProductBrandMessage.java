package ezstore.messages;

import ezstore.helpers.Validation;

public class ProductBrandMessage implements Message {
    private String name;
    private String url;
    private boolean visible = true;

    public ProductBrandMessage() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    @Override
    public Validation validate() {
        Validation validation = new Validation();

        if (name == null || name.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("name", "Name cannot be empty");
        }
        if (url == null || url.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("url", "url cannot be empty");
        }

        return validation;
    }

}
