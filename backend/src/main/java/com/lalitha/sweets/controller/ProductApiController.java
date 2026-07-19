package com.lalitha.sweets.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.lalitha.sweets.dto.ProductDto;
import com.lalitha.sweets.repository.ProductRepository;

/**
 * Public storefront catalog endpoints. Replaces the old server-rendered
 * ShopController / CustomerProductController / HomeController category
 * pages (/sweets, /hot, /specials, /pickels, /shop/category/{category})
 * with a single JSON API the React app drives client-side routing from.
 */
@RestController
@RequestMapping("/api/products")
public class ProductApiController {

	private final ProductRepository productRepository;

	public ProductApiController(ProductRepository productRepository) {
		this.productRepository = productRepository;
	}

	@GetMapping
	public List<ProductDto> all() {
		return productRepository.findAllEnabledWithPrices()
				.stream()
				.map(ProductDto::new)
				.toList();
	}

	@GetMapping("/category/{category}")
	public List<ProductDto> byCategory(@PathVariable String category) {
		return productRepository.findByCategoryWithPrices(category)
				.stream()
				.filter(p -> p.isEnabled())
				.map(ProductDto::new)
				.toList();
	}
}
