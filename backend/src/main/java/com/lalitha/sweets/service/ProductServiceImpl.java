package com.lalitha.sweets.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lalitha.sweets.model.Product;
import com.lalitha.sweets.repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public Product save(Product product) {
    	
    	Optional<Product> existingProduct =
                productRepository.findByNameIgnoreCase(product.getName());

        if(existingProduct.isPresent()) {

            Product existing = existingProduct.get();

            // Allow update if editing same product
            if(product.getId() == null || !existing.getId().equals(product.getId())) {
                throw new RuntimeException("Product already exists!");
            }
        }
    
        return productRepository.save(product);
    }

    @Override
    public Product getById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    // 🔥 VERY IMPORTANT
    @Override
    public List<Product> findAllWithPrices() {
        return productRepository.findAllWithPrices();
    }

    @Override
    public List<Product> getFeatured() {
        return productRepository.findFeaturedProducts();
    }

    @Override
    public List<Product> getByCategory(String category) {
        return productRepository.findByCategoryWithPrices(category);
    }

	@Override
	public List<Product> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Object getFeaturedProducts() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Product> findAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Product> getSweets() {
		// TODO Auto-generated method stub
		return productRepository.findByCategoryWithPrices("Sweet");
	}

	@Override
	public List<Product> getHot() {
		// TODO Auto-generated method stub
		return null;
	}
}
