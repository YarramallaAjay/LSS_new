package com.lalitha.sweets.model;

import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name="product_prices")
public class ProductPrice {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String label;
	
	@Column(nullable = false)
	private BigDecimal price;
	
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;

	
	
	public Long getId() {return id;}
	public void setId(Long id) {this.id = id;}

	
	public String getLabel() {return label;}
	public void setLabel(String label) {this.label = label;}

	
	public BigDecimal getPrice() {return price;}
	public void setPrice(BigDecimal price) {this.price = price;}

	
	public Product getProduct() {return product;}
	public void setProduct(Product product) {this.product = product;}
	
}
