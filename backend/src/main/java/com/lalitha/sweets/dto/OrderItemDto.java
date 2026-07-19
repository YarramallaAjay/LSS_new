package com.lalitha.sweets.dto;

import java.math.BigDecimal;

import com.lalitha.sweets.model.OrderItem;

public class OrderItemDto {

	private Long id;
	private String productName;
	private String priceLabel;
	private BigDecimal price;
	private int quantity;
	private BigDecimal subtotal;

	public OrderItemDto() {
	}

	public OrderItemDto(OrderItem item) {
		this.id = item.getId();
		this.productName = item.getProductName();
		this.priceLabel = item.getPriceLabel();
		this.price = item.getPrice();
		this.quantity = item.getQuantity();
		this.subtotal = item.getPrice() != null
				? item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
				: BigDecimal.ZERO;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getPriceLabel() {
		return priceLabel;
	}

	public void setPriceLabel(String priceLabel) {
		this.priceLabel = priceLabel;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public BigDecimal getSubtotal() {
		return subtotal;
	}

	public void setSubtotal(BigDecimal subtotal) {
		this.subtotal = subtotal;
	}
}
