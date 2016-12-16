package ezstore.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ezstore.auth.PasswordHelper;
import ezstore.entities.structs.Role;
import ezstore.messages.UserMessage;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;
import java.util.Set;

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

    private String vat;

    @ElementCollection(fetch = FetchType.EAGER)
    @JoinTable(name = "roles_users", joinColumns = @JoinColumn(name = "userId"))
    private Set<Role> roles;

    @OneToOne(targetEntity = Address.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "defaultBillingAddressId")
    private Address defaultBillingAddress;

    @OneToOne(targetEntity = Address.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "defaultShippingAddressId")
    private Address defaultShippingAddress;

    @OneToMany(targetEntity = Address.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "userId")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Address> addresses;

    public User() {
    }

    public void applyMessage(UserMessage userMessage) {
        this.setEmail(userMessage.getEmail());
        if (userMessage.getPassword() != null && ! userMessage.getPassword().isEmpty()) {
            this.setPassword(PasswordHelper.getSaltedHash(userMessage.getPassword()));
            this.setToken(null);
        }

        this.setFirstName(userMessage.getFirstName());
        this.setLastName(userMessage.getLastName());
        this.setPhone(userMessage.getPhone());
        this.setBornDate(userMessage.getBornDate());
        this.setVat(userMessage.getVat());
        this.setRoles(userMessage.getRoles());
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

    public String getVat() {
        return vat;
    }

    public void setVat(String vat) {
        this.vat = vat;
    }

    public Address getDefaultBillingAddress() {
        return defaultBillingAddress;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
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

    public boolean hasRole(Role role) {
        if (this.roles.size() > 0) {
            if (this.roles.contains(Role.OWNER)) return true;
            if (this.roles.contains(role)) return true;
        }
        return false;
    }
}
