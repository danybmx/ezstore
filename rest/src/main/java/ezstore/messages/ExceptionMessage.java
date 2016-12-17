package ezstore.messages;

/**
 * Created by daniel on 17/12/16.
 */
public class ExceptionMessage {
    private String exception;
    private String message;
    private Object details;

    public ExceptionMessage() {
    }

    public ExceptionMessage(String exception, String message, Object details) {
        this.exception = exception;
        this.message = message;
        this.details = details;
    }

    public String getException() {
        return exception;
    }

    public void setException(String exception) {
        this.exception = exception;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getDetails() {
        return details;
    }

    public void setDetails(Object details) {
        this.details = details;
    }
}
