package ezstore.helpers;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Validation {
    private boolean valid;
    private HashMap<String, String> reasons;
    private String message;

    public Validation() {
        valid = true;
        reasons = new HashMap<String, String>();
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public HashMap<String, String> getReasons() {
        return reasons;
    }

    public void setReasons(HashMap<String, String> reasons) {
        this.reasons = reasons;
        this.message = "";
    }

    public String getMessage() {
        if (this.reasons.size() > 0) {
            StringBuilder sb = new StringBuilder();
            for (HashMap.Entry<String, String> reason : this.reasons.entrySet()) {
                sb.append(reason.getValue());
                sb.append(", ");
            }
            sb.setLength(sb.length() - 2);
            this.message = sb.toString();
        }

        return this.message;
    }

    @JsonIgnore
    public Response getErrorResponse() {
        return Response
                .status(Response.Status.BAD_REQUEST)
                .type(MediaType.APPLICATION_JSON)
                .entity(this)
                .build();
    }

}
