package com.lalitha.sweets.model;

import java.math.BigDecimal;

import jakarta.persistence.*;

@Entity
@Table(name="order_items")
public class OrderItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	//private Long productId;
	@Column(name = "product_name")
	private String productName;
	
	@Column(name = "price_label")
	private String priceLabel;
	
	private BigDecimal price;
	
	private int quantity;
	
	@Column(name = "subtotal")
	private BigDecimal subtotal;
	
	
	@ManyToOne
	@JoinColumn(name = "order_id")
	private Order order;


	
	public Long getId() {return id;}
	public void setId(Long id) {this.id = id;}


	public String getProductName() {return productName;}
	public void setProductName(String productName) {this.productName = productName;}


	public String getPriceLabel() {return priceLabel;}
	public void setPriceLabel(String priceLabel) {this.priceLabel = priceLabel;}


	public BigDecimal getPrice() {return price;}
	public void setPrice(BigDecimal productPrice) {this.price = productPrice;}


	public int getQuantity() {return quantity;}
	public void setQuantity(int quantity) {this.quantity = quantity;}


	public BigDecimal getSubtotal() {return subtotal;}
	public void setSubtotal(BigDecimal subtotal) {this.subtotal = subtotal;}


	public Order getOrder() {return order;}
	public void setOrder(Order order) {this.order = order;}
	
//	public Long getProductId() {return productId;}
//	public void setProductId(Long productId) {this.productId = productId;}
//	
}
