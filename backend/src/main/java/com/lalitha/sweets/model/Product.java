package com.lalitha.sweets.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name="products")
public class Product {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false, unique = true)
	private String name;
	
	@Column(nullable = false)
	private String category;
	
	@Column(length = 1000)
	private String description;
	
	private String imageUrl;
	
	@Column(nullable = false)
	private String pricingType;
	
	@Column(nullable = false)
	private boolean enabled = true;
	
	@Column(nullable = false)
	private boolean featured = false;
	
	@OneToMany(mappedBy = "product", cascade = CascadeType.ALL,orphanRemoval = true)
	private List<ProductPrice> prices = new ArrayList<>();

	
	public Long getId() {return id;}
	public void setId(Long id) {this.id = id;}

	
	public String getName() {return name;}
	public void setName(String name) {this.name = name;}

	
	public String getCategory() {return category;}
	public void setCategory(String category) {this.category = category;}

	
	public String getDescription() {return description;}
	public void setDescription(String description) {this.description = description;}

	
	public String getImageUrl() {return imageUrl;}
	public void setImageUrl(String imageUrl) {this.imageUrl = imageUrl;}

	
	public String getPricingType() {return pricingType;}
	public void setPricingType(String pricingType) {this.pricingType = pricingType;}

	
	public boolean isEnabled() {return enabled;}
	public void setEnabled(boolean enabled) {this.enabled = enabled;}

	
	public List<ProductPrice> getPrices() {return prices;}
	public void setPrices(List<ProductPrice> prices) {this.prices = prices;}
	
	public boolean isFeatured() {
	    return featured;
	}

	public void setFeatured(boolean featured) {
	    this.featured = featured;
	}
}
