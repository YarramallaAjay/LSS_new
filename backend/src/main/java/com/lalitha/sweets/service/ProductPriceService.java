package com.lalitha.sweets.service;

import java.util.List;

import com.lalitha.sweets.model.ProductPrice;

public interface ProductPriceService {

	ProductPrice save(ProductPrice price);
	
	List<ProductPrice> getByProductId(Long productId);
	
	void deleteByProductId(Long productId);
}
