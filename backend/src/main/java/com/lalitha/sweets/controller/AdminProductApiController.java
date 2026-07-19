package com.lalitha.sweets.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lalitha.sweets.dto.ProductDto;
import com.lalitha.sweets.dto.ProductSaveRequest;
import com.lalitha.sweets.model.Product;
import com.lalitha.sweets.model.ProductPrice;
import com.lalitha.sweets.repository.ProductRepository;
import com.lalitha.sweets.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductApiController {

	private final ProductService productService;
	private final ProductRepository productRepository;

	public AdminProductApiController(ProductService productService, ProductRepository productRepository) {
		this.productService = productService;
		this.productRepository = productRepository;
	}

	@GetMapping
	public List<ProductDto> list() {
		return productService.findAllWithPrices().stream().map(ProductDto::new).toList();
	}

	@GetMapping("/{id}")
	public ProductDto get(@PathVariable Long id) {
		Product product = productRepository.findByIdWithPrices(id)
				.orElseThrow(() -> new NoSuchElementException("Product not found"));
		return new ProductDto(product);
	}

	@PostMapping
	public ResponseEntity<ProductDto> create(@Valid @RequestBody ProductSaveRequest request) {
		Product saved = saveProduct(new Product(), request);
		return ResponseEntity.ok(new ProductDto(saved));
	}

	@PutMapping("/{id}")
	public ProductDto update(@PathVariable Long id, @Valid @RequestBody ProductSaveRequest request) {
		Product existing = productRepository.findByIdWithPrices(id)
				.orElseThrow(() -> new NoSuchElementException("Product not found"));
		Product saved = saveProduct(existing, request);
		return new ProductDto(saved);
	}

	private Product saveProduct(Product product, ProductSaveRequest request) {

		product.setName(request.getName());
		product.setCategory(request.getCategory());
		product.setDescription(request.getDescription());
		product.setImageUrl(request.getImageUrl());
		product.setPricingType(request.getPricingType());
		product.setEnabled(request.isEnabled());
		product.setFeatured(request.isFeatured());

		product.getPrices().clear();

		if (request.getPrices() != null) {
			for (ProductSaveRequest.PriceInput priceInput : request.getPrices()) {

				if (priceInput.getPrice() == null || priceInput.getLabel() == null || priceInput.getLabel().isBlank()) {
					continue;
				}

				ProductPrice price = new ProductPrice();
				price.setLabel(priceInput.getLabel());
				price.setPrice(priceInput.getPrice());
				price.setProduct(product);
				product.getPrices().add(price);
			}
		}

		return productService.save(product);
	}

	@PostMapping("/{id}/toggle")
	public ProductDto toggleAvailability(@PathVariable Long id) {

		Product p = productRepository.findById(id)
				.orElseThrow(() -> new NoSuchElementException("Product not found"));

		p.setEnabled(!p.isEnabled());
		return new ProductDto(productRepository.save(p));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		if (!productRepository.existsById(id)) {
			throw new NoSuchElementException("Product not found");
		}
		productRepository.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
