package com.lalitha.sweets.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lalitha.sweets.model.ProductPrice;
import com.lalitha.sweets.repository.ProductPriceRepository;

@Service
public class ProductPriceServiceImpl implements ProductPriceService{

	private final ProductPriceRepository productPriceRepository;
	
	
	public ProductPriceServiceImpl(ProductPriceRepository productPriceRepository) {
		this.productPriceRepository = productPriceRepository;
	}

	
	@Override
	public ProductPrice save(ProductPrice price) {
		// TODO Auto-generated method stub
		return productPriceRepository.save(price);
	}

	@Override
	public List<ProductPrice> getByProductId(Long productId) {
		// TODO Auto-generated method stub
		return productPriceRepository.findByProductId(productId);
	}

	@Override
	public void deleteByProductId(Long productId) {
		// TODO Auto-generated method stub
		productPriceRepository.findByProductId(productId).forEach(productPriceRepository::delete);
	}

}
