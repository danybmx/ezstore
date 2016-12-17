package ezstore.exceptions;

import ezstore.messages.NoStockExceptionMessage;

import javax.json.JsonObject;
import java.util.HashMap;

/**
 * Created by daniel on 17/12/16.
 */
public class NoStockException extends Exception {
    private NoStockExceptionMessage details;

    public NoStockException(String productName, Long productId, Long optionId, Integer availableUnits) {
        this.details = new NoStockExceptionMessage(productName, productId, optionId, availableUnits);
    }

    public NoStockExceptionMessage getDetails() {
        return this.details;
    }
}
