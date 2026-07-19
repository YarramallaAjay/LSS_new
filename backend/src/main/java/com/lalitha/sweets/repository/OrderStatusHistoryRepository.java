package com.lalitha.sweets.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lalitha.sweets.model.Order;
import com.lalitha.sweets.model.OrderStatus;
import com.lalitha.sweets.model.OrderStatusHistory;

public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Long>{

	List<OrderStatusHistory> findByOrderIdOrderByUpdatedTimeAsc(Long orderId);
	
	Optional<OrderStatusHistory> findTopByOrderAndStatusOrderByUpdatedTimeDesc(Order order, OrderStatus status);
	
}
