package ezstore.messages;

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
    public boolean isValid() {
        boolean valid = true;

        if (this.name == null || this.name.trim().length() < 1) valid = false;

        return valid;
    }
}
