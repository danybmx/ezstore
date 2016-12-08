package ezstore.messages;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import ezstore.entities.Address;
import ezstore.helpers.Validation;

public class StorageMessage implements Message {
    private String name;
    private String phone;

    private Address address;

    public StorageMessage() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    @Override
    public Validation validate() {
        Validation validation = new Validation();

        if (name == null || name.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("name", "Name cannot be empty");
        }

        if (phone == null || phone.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("phone", "Phone cannot be empty");
        }

        return validation;
    }
}
