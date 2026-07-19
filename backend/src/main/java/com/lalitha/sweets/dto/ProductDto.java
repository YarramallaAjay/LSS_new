package com.lalitha.sweets.dto;

import java.util.List;

import com.lalitha.sweets.model.Product;

public class ProductDto {

	private Long id;
	private String name;
	private String category;
	private String description;
	private String imageUrl;
	private String pricingType;
	private boolean enabled;
	private boolean featured;
	private List<ProductPriceDto> prices;

	public ProductDto() {
	}

	public ProductDto(Product product) {
		this.id = product.getId();
		this.name = product.getName();
		this.category = product.getCategory();
		this.description = product.getDescription();
		this.imageUrl = product.getImageUrl();
		this.pricingType = product.getPricingType();
		this.enabled = product.isEnabled();
		this.featured = product.isFeatured();
		this.prices = product.getPrices() == null
				? List.of()
				: product.getPrices().stream().map(ProductPriceDto::new).toList();
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

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public String getPricingType() {
		return pricingType;
	}

	public void setPricingType(String pricingType) {
		this.pricingType = pricingType;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public boolean isFeatured() {
		return featured;
	}

	public void setFeatured(boolean featured) {
		this.featured = featured;
	}

	public List<ProductPriceDto> getPrices() {
		return prices;
	}

	public void setPrices(List<ProductPriceDto> prices) {
		this.prices = prices;
	}
}
