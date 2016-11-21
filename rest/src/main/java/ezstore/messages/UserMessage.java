package ezstore.messages;

import ezstore.helpers.Validation;

import java.sql.Date;

public class UserMessage implements Message {

    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private String bornDate;
    private String VAT;

    public UserMessage() {

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
        return Date.valueOf(bornDate);
    }

    public void setBornDate(String bornDate) {
        this.bornDate = bornDate;
    }

    public String getVAT() {
        return VAT;
    }

    public void setVAT(String VAT) {
        this.VAT = VAT;
    }

    @Override
    public Validation validate() {
        Validation validation = new Validation();

        if (email == null || email.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("email", "Email cannot be empty");
        }
        if (password == null || password.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("password", "Password cannot be empty");
        }
        if (firstName == null || firstName.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("firstName", "First name cannot be empty");
        }
        if (lastName == null || lastName.trim().length() < 1) {
            validation.setValid(false);
            validation.getReasons().put("lastName", "Last name cannot be empty");
        }

        return validation;
    }

}
