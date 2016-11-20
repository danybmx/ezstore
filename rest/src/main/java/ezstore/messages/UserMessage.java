package ezstore.messages;

public class UserMessage implements Message {

    private String email;
    private String password;

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

    @Override
    public boolean isValid() {
        boolean valid = true;

        if (email == null || email.trim().length() < 1) valid = false;
        if (password == null || password.trim().length() < 1) valid = false;

        return valid;
    }

}
