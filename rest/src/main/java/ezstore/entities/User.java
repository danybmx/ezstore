package ezstore.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;

@Entity
@Table(name = "users")
@NamedQuery(name = "getUserByEmail", query = "SELECT u FROM User u WHERE u.email = :email")
public class User {

    @Id
    @GeneratedValue
    private Long id;

    // Unique email
    @Column(unique = true)
    private String email;

    // Security related fields
    @JsonIgnore
    private String password;
    private String token;

    private String firstName;
    private String lastName;
    private String phone;
    private Date bornDate;

    private String VAT;

    @OneToOne(targetEntity = Address.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "defaultBillingAddressId")
    private Address defaultBillingAddress;

    @OneToOne(targetEntity = Address.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "defaultShippingAddressId")
    private Address defaultShippingAddress;

    @OneToMany(targetEntity = Address.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "userId")
    private List<Address> addresses;

    public User() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Date getBornDate() {
        return bornDate;
    }

    public void setBornDate(Date bornDate) {
        this.bornDate = bornDate;
    }

    public String getVAT() {
        return VAT;
    }

    public void setVAT(String VAT) {
        this.VAT = VAT;
    }

    public Address getDefaultBillingAddress() {
        return defaultBillingAddress;
    }

    public void setDefaultBillingAddress(Address defaultBillingAddress) {
        this.defaultBillingAddress = defaultBillingAddress;
    }

    public Address getDefaultShippingAddress() {
        return defaultShippingAddress;
    }

    public void setDefaultShippingAddress(Address defaultShippingAddress) {
        this.defaultShippingAddress = defaultShippingAddress;
    }

    public List<Address> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<Address> addresses) {
        this.addresses = addresses;
    }
}
