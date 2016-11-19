package ezstore.entities;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne(targetEntity = User.class)
    @JoinColumn(name = "customerId")
    private User customer;

    @OneToOne(targetEntity = Address.class)
    @JoinColumn(name = "billingAddressId")
    private Address billingAddress;

    @OneToOne(targetEntity = Address.class)
    @JoinColumn(name = "shippingAddressId")
    private Address shippingAddress;

    @OneToMany(targetEntity = OrderProduct.class)
    @JoinColumn(name = "orderId")
    private List<OrderProduct> products;
}
