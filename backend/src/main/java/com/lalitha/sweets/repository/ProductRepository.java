package com.lalitha.sweets.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.lalitha.sweets.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

	@Query("""
	        SELECT DISTINCT p
	        FROM Product p
	        LEFT JOIN FETCH p.prices
	        WHERE p.category = :category
	        AND p.enabled = true
	    """)
	List<Product> findByCategoryWithPrices(@Param("category") String category);

	@Query("""
		    SELECT DISTINCT p
		    FROM Product p
		    LEFT JOIN FETCH p.prices
		""")
	List<Product> findAllWithPrices();

	@Query("""
		    SELECT DISTINCT p
		    FROM Product p
		    LEFT JOIN FETCH p.prices
		    WHERE p.enabled = true
		""")
	List<Product> findAllEnabledWithPrices();

	@Query("""
		    SELECT DISTINCT p
		    FROM Product p
		    LEFT JOIN FETCH p.prices
		    WHERE p.featured = true AND p.enabled = true
		""")
	List<Product> findFeaturedProducts();

	@Query("""
		    SELECT p
		    FROM Product p
		    LEFT JOIN FETCH p.prices
		    WHERE p.id = :id
		""")
	Optional<Product> findByIdWithPrices(@Param("id") Long id);

	Optional<Product> findByNameIgnoreCase(String name);
}
