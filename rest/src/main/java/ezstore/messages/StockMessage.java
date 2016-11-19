package ezstore.messages;

public class StockMessage implements Message {
    private Long storage;
    private Long option;
    private Integer units;

    public StockMessage() {
    }

    public Long getStorage() {
        return storage;
    }

    public void setStorage(Long storage) {
        this.storage = storage;
    }

    public Long getOption() {
        return option;
    }

    public void setOption(Long option) {
        this.option = option;
    }

    public int getUnits() {
        return units;
    }

    public void setUnits(int units) {
        this.units = units;
    }

    @Override
    public boolean isValid() {
        boolean valid = true;

        if (this.storage == null || this.storage < 1) valid = false;
        if (this.option == null || this.option < 1) valid = false;
        if (this.units == null) valid = false;

        return valid;
    }
}
