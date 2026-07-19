package com.lalitha.sweets.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class CartItem {

	@JsonIgnore
	private Product product;
	//private ProductPrice price;
	private Long productId;
	private String productName;
	private String priceLabel;
	private BigDecimal price;
	private int quantity;
	private String imageUrl;
	private Long priceId;
	
	
	
	
	public CartItem(Product product, BigDecimal price, int quantity) {
		this.product = product;
		this.price = price;
		this.quantity = quantity;
	}

	public CartItem() {
		// TODO Auto-generated constructor stub
	}

	public Product getProduct() {
		return product;
	}
	
	public void setProduct(Product product) {
		this.product = product;
	}
	
	public Long getProductId() {return productId;}
	public void setProductId(Long productId) {this.productId = productId;}
	
	
	public String getProductName() {return productName;}
	public void setProductName(String productName) {this.productName = productName;}
	
	
	public String getPriceLabel() {return priceLabel;}
	public void setPriceLabel(String priceLabel) {this.priceLabel = priceLabel;}
	
	
	public BigDecimal getPrice() {return price;}
	public void setPrice(BigDecimal price) {this.price = price;}
	
	
	public int getQuantity() {return quantity;}
	public void setQuantity(int quantity) {this.quantity = quantity;}
	
	
	public String getImageUrl() {return imageUrl;}
	public void setImageUrl(String imageUrl) {this.imageUrl = imageUrl;}
	
	public BigDecimal getSubtotal() {
		if (price == null) {
			return BigDecimal.ZERO;
		}
		
		return price.multiply(BigDecimal.valueOf(quantity));
	}

	public void setPriceId(Long id) {
		this.priceId = id;
		
	}
	
	public Long getPriceId() {
		return priceId;
	}
}










