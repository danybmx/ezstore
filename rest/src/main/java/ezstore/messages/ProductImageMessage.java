package ezstore.messages;

import ezstore.helpers.Validation;

public class ProductImageMessage implements Message {
    private String file;
    private int position;

    public ProductImageMessage() {
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
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

        if (file == null || file.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("file", "file cannot be empty");
        }

        return validation;
    }
}
