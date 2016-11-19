package ezstore.messages;

public class ProductCategoryMessage implements Message {
    private String name;
    private String key;

    public ProductCategoryMessage() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    @Override
    public boolean isValid() {
        boolean valid = true;

        if (this.name == null || this.name.trim().length() < 1) valid = false;
        if (this.key == null || this.key.length() < 1)  valid = false;

        return valid;
    }
}
