package com.lalitha.sweets.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

/**
 * Payload for creating/updating a product from the admin panel. Kept
 * separate from the Product entity/DTO so the write contract (what the
 * client is allowed to send) doesn't silently change whenever the entity
 * changes shape.
 */
public class ProductSaveRequest {

	private Long id;

	@NotBlank
	private String name;

	@NotBlank
	private String category;

	private String description;

	private String imageUrl;

	@NotBlank
	private String pricingType;

	private boolean enabled = true;

	private boolean featured = false;

	@Valid
	private List<PriceInput> prices;

	public static class PriceInput {

		@NotBlank
		private String label;

		private java.math.BigDecimal price;

		public String getLabel() {
			return label;
		}

		public void setLabel(String label) {
			this.label = label;
		}

		public java.math.BigDecimal getPrice() {
			return price;
		}

		public void setPrice(java.math.BigDecimal price) {
			this.price = price;
		}
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

	public List<PriceInput> getPrices() {
		return prices;
	}

	public void setPrices(List<PriceInput> prices) {
		this.prices = prices;
	}
}
