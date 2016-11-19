package ezstore.entities;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue
    private Long id;

    private String email;
    private String password;
    private String salt;

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

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }
}
