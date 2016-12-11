package ezstore.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table("roles")
public class Role {

    @Id
    @GeneratedValue
    private Long id;


}
