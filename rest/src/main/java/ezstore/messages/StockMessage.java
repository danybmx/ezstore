package ezstore.messages;

import ezstore.helpers.Validation;

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
    public Validation validate() {
        Validation validation = new Validation();

        if (storage == null || storage < 1) {
            validation.setValid(false);
            validation.getReasons().put("storage", "Storage must be defined");
        }

        if (option == null || option < 1) {
            validation.setValid(false);
            validation.getReasons().put("option", "Product option must be defined");
        }

        if (units == null) {
            validation.setValid(false);
            validation.getReasons().put("units", "Units cannot be blank");
        }

        return validation;
    }
}
