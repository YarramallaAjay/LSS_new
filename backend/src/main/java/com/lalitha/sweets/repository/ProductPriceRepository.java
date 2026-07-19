package com.lalitha.sweets.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lalitha.sweets.model.ProductPrice;

public interface ProductPriceRepository extends JpaRepository<ProductPrice, Long>{

	List<ProductPrice> findByProductId(Long productId);
	
	ProductPrice findFirstByProductId(Long productId);

}
