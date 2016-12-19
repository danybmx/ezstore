package ezstore.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import ezstore.entities.structs.OrderType;
import ezstore.entities.structs.PaymentMethod;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "orders")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Order {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "customerId")
    private User customer;

    @OneToOne(targetEntity = Storage.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "storageId")
    private Storage storage;

    @OneToOne(targetEntity = Order.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "parentId")
    private Order parent;

    @OneToOne(targetEntity = Address.class, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "billingAddressId")
    private Address billingAddress;

    @OneToOne(targetEntity = Address.class, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "shippingAddressId")
    private Address shippingAddress;

    @OneToMany(targetEntity = OrderProduct.class, fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "orderId")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<OrderProduct> products;

    @OneToMany(targetEntity = Tax.class, fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "orderId")
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Tax> taxes;

    private OrderType orderType;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer reference;
    private String customerName;
    private String vat;
    private String mail;
    private String phone;
    private String notes;
    private Double discount;
    private Double subtotal;
    private Double shipping;
    private Double total;

    private boolean paid;
    private PaymentMethod paymentMethod;
    private String paymentInfo;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    private Date modifiedAt;

    public Order() {
        createdAt = new Date();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public Storage getStorage() {
        return storage;
    }

    public void setStorage(Storage storage) {
        this.storage = storage;
    }

    public Order getParent() {
        return parent;
    }

    public void setParent(Order parent) {
        this.parent = parent;
    }

    public String getReference() {
        return this.orderType.name() + "-" + String.format("%06d", this.reference);
    }

    public Integer getReferenceNumber() {
        return this.reference;
    }

    public void setReference(Integer reference) {
        this.reference = reference;
    }

    public Address getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(Address billingAddress) {
        this.billingAddress = billingAddress;
    }

    public Address getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(Address shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public List<OrderProduct> getProducts() {
        return products;
    }

    public void setProducts(List<OrderProduct> products) {
        this.products = products;
    }

    public List<Tax> getTaxes() {
        return taxes;
    }

    public void setTaxes(List<Tax> taxes) {
        this.taxes = taxes;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getVat() {
        return vat;
    }

    public void setVat(String vat) {
        this.vat = vat;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public Double getShipping() {
        return shipping;
    }

    public void setShipping(Double shipping) {
        this.shipping = shipping;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public OrderType getOrderType() {
        return orderType;
    }

    public void setOrderType(OrderType orderType) {
        this.orderType = orderType;
    }

    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentInfo() {
        return paymentInfo;
    }

    public void setPaymentInfo(String paymentInfo) {
        this.paymentInfo = paymentInfo;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }
}
