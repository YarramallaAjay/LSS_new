package com.lalitha.sweets.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lalitha.sweets.model.Product;
import com.lalitha.sweets.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product save(Product product) {
        Optional<Product> existingProduct =
                productRepository.findByNameIgnoreCase(product.getName());

        if (existingProduct.isPresent()) {
            Product existing = existingProduct.get();
            if (product.getId() == null || !existing.getId().equals(product.getId())) {
                throw new RuntimeException("Product already exists!");
            }
        }

        return productRepository.save(product);
    }

    public Product getById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    public List<Product> findAllWithPrices() {
        return productRepository.findAllWithPrices();
    }

    public List<Product> getFeatured() {
        return productRepository.findFeaturedProducts();
    }

    public List<Product> getByCategory(String category) {
        return productRepository.findByCategoryWithPrices(category);
    }
}
