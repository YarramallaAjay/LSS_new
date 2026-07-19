package com.lalitha.sweets.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lalitha.sweets.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>{

	List<Product> findByEnabledTrue();
	
	Page<Product> findByFeaturedTrue(Pageable pageable);

	Page<Product> findByCategoryAndEnabledTrue(String string, Pageable pageable);
	
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
	
	
	
	
	
	
	
	
	
	
	

//	@Query("""
//	        SELECT DISTINCT p
//	        FROM Product p
//	        LEFT JOIN FETCH p.prices
//	    """)
//	List<Product> findAllWithPrices();
//	
//	List<Product> findTop30ByOrderByIdDesc();
//	
//	List<Product> findTop20ByCategoryOrderByIdDesc(String category);
//
//	
//	List<Product> findTop20ByCategory(String category);
	
	
	//List<Product> findFeaturedProducts();
	
	
	
	
//	@Query("""
//			   SELECT DISTINCT p 
//			   FROM Product p 
//			   LEFT JOIN FETCH p.prices
//			   WHERE p.category = :category
//			""")
//	List<Product> findByCategoryWithPrices(@Param("category") String category);


//	@Query("""
//			   SELECT DISTINCT p 
//			   FROM Product p 
//			   LEFT JOIN FETCH p.prices
//			   ORDER BY function('RAND')
//			""")
//	List<Product> findFeaturedWithPrices(Pageable pageable);

	
}
