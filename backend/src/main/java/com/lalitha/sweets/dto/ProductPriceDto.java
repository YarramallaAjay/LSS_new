package com.lalitha.sweets.dto;

import java.math.BigDecimal;

import com.lalitha.sweets.model.ProductPrice;

public class ProductPriceDto {

	private Long id;
	private String label;
	private BigDecimal price;

	public ProductPriceDto() {
	}

	public ProductPriceDto(ProductPrice price) {
		this.id = price.getId();
		this.label = price.getLabel();
		this.price = price.getPrice();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}
}
