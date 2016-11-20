package ezstore.entities;

import ezstore.messages.AddressMessage;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private String line1;
    private String line2;
    private String line3;
    private String city;
    private String state;
    private String country;
    private String postalCode;

    public Address() {
    }

    public Address(AddressMessage message) {
        this.applyMessage(message);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getFullAddress() {
        String address = this.line1;
        if (this.line2 != null) {
            address += "\r\n" + this.line2;
        }
        if (this.line3 != null) {
            address += "\r\n" + this.line3;
        }
        address += "\r\n" + this.city;
        if (this.postalCode != null) {
            address += ", " + this.postalCode;
        }
        if (this.state != null) {
            address += ", " + this.state;
        }
        address += "\r\n" + this.country;
        return address;
    }

    public void applyMessage(AddressMessage message) {
        this.name = message.getName();
        this.line1 = message.getLine1();
        this.line2 = message.getLine2();
        this.line3 = message.getLine3();
        this.city = message.getCity();
        this.state = message.getState();
        this.country = message.getCountry();
        this.postalCode = message.getPostalCode();
    }
}
