package ezstore.messages;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ezstore.entities.structs.Role;
import ezstore.helpers.Validation;

import javax.xml.bind.DatatypeConverter;
import java.sql.Date;
import java.util.Calendar;
import java.util.Set;

public class UserMessage implements Message {

    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private String bornDate;
    private String vat;
    private Set<Role> roles;

    @JsonIgnore
    private boolean update = false;

    public UserMessage() {

    }

    public void setUpdate(boolean update) {
        this.update = update;
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
        if (bornDate != null) {
            Calendar calendar = DatatypeConverter.parseDate(bornDate);
            return new Date(calendar.getTimeInMillis());
        } else {
            return null;
        }
    }

    public void setBornDate(String bornDate) {
        this.bornDate = bornDate;
    }

    public String getVat() {
        return vat;
    }

    public void setVat(String vat) {
        this.vat = vat;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    @Override
    public Validation validate() {
        Validation validation = new Validation();

        if (email == null || email.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("email", "Email cannot be empty");
        }
        if (firstName == null || firstName.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("firstName", "First name cannot be empty");
        }
        if (lastName == null || lastName.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("lastName", "Last name cannot be empty");
        }

        if (!this.update) {
            if (password == null || password.trim().length() < 1) {
                validation.setValid(false);
                validation.getReasons().put("password", "Password cannot be empty");
            }
        }

        return validation;
    }

}
