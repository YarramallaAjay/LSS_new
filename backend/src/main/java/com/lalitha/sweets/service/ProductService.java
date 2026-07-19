package com.lalitha.sweets.service;

import java.util.List;

import com.lalitha.sweets.model.Product;

public interface ProductService {

	Product save(Product product);
	
	Product getById(Long id);
	
	List<Product> getAll();
	
	void delete(Long id);

	Object getFeaturedProducts();

	List<Product> findAll();
	
	List<Product> findAllWithPrices();
	
	List<Product> getFeatured();
	
	List<Product> getSweets();
	
	List<Product> getHot();
	
	List<Product> getByCategory(String category);
	
	
}
