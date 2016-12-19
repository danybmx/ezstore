package ezstore.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.RoundingMode;
import java.text.DecimalFormat;

@Entity
@Table(name = "taxes")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Tax {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private Double value;
    private Double total;

    public Tax() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public void calculateFrom(Double total) {
        DecimalFormat df = new DecimalFormat("#.##");
        df.setRoundingMode(RoundingMode.HALF_UP);

        this.total = Double.valueOf(df.format(total * this.value / 100));
    }
}
