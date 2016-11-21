package ezstore.messages;

import ezstore.helpers.Validation;

public class AddressMessage implements Message {
    private String name; // required
    private String line1; // required
    private String line2;
    private String line3;
    private String city; // required
    private String state;
    private String country; // required
    private String postalCode;

    public AddressMessage() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLine1() {
        return line1;
    }

    public void setLine1(String line1) {
        this.line1 = line1;
    }

    public String getLine2() {
        return line2;
    }

    public void setLine2(String line2) {
        this.line2 = line2;
    }

    public String getLine3() {
        return line3;
    }

    public void setLine3(String line3) {
        this.line3 = line3;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    @Override
    public Validation validate() {
        Validation validation = new Validation();

        if (name == null || name.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("name", "Name cannot be empty");
        }
        if (line1 == null || line1.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("line1", "Address cannot be empty");
        }
        if (city == null || city.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("city", "City cannot be empty");
        }
        if (country == null || country.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("country", "Country cannot be empty");
        }

        return validation;
    }

}
