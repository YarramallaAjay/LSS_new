package com.lalitha.sweets.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.lalitha.sweets.model.*;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long>{

	@Query("SELECT oi.productName, SUM(oi.quantity) FROM OrderItem oi GROUP BY oi.productName ORDER BY SUM(oi.quantity) DESC LIMIT 10")
	List<Object[]> getTopSellingProducts();
}
