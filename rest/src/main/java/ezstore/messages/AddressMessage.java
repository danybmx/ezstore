package ezstore.messages;

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
    public boolean isValid() {
        boolean valid = true;

        if (this.name == null || this.name.trim().length() < 1) valid = false;
        if (this.line1 == null || this.line1.trim().length() < 1) valid = false;
        if (this.city == null || this.city.trim().length() < 1) valid = false;
        if (this.country == null || this.country.trim().length() < 1) valid = false;

        return valid;
    }
}
