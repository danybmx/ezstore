package ezstore.messages;

/**
 * Created by daniel on 17/12/16.
 */
public class NoStockExceptionMessage {
    private String productName;
    private Long productId;
    private Long optionId;
    private Integer availableUnits;

    public NoStockExceptionMessage() {
    }

    public NoStockExceptionMessage(String productName, Long productId, Long optionId, Integer availableUnits) {
        this.productName = productName;
        this.productId = productId;
        this.optionId = optionId;
        this.availableUnits = availableUnits;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getOptionId() {
        return optionId;
    }

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }

    public Integer getAvailableUnits() {
        return availableUnits;
    }

    public void setAvailableUnits(Integer availableUnits) {
        this.availableUnits = availableUnits;
    }
}
