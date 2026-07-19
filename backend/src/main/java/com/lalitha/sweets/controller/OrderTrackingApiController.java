package com.lalitha.sweets.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.web.bind.annotation.*;

import com.lalitha.sweets.dto.OrderDto;
import com.lalitha.sweets.model.Order;
import com.lalitha.sweets.model.OrderStatus;
import com.lalitha.sweets.model.OrderStatusHistory;
import com.lalitha.sweets.repository.OrderStatusHistoryRepository;
import com.lalitha.sweets.service.OrderService;

/**
 * Customer-facing order tracking and self-service cancellation. Replaces
 * the old server-rendered /track/{id} page and /orders/cancel/{id} form
 * post.
 */
@RestController
@RequestMapping("/api/orders")
public class OrderTrackingApiController {

	private final OrderService orderService;
	private final OrderStatusHistoryRepository historyRepository;

	public OrderTrackingApiController(OrderService orderService, OrderStatusHistoryRepository historyRepository) {
		this.orderService = orderService;
		this.historyRepository = historyRepository;
	}

	@GetMapping("/{id}/track")
	public Map<String, Object> track(@PathVariable Long id) {

		Order order = orderService.getOrder(id);

		if (order == null) {
			throw new NoSuchElementException("Order not found");
		}

		List<OrderStatusHistory> history =
				historyRepository.findByOrderIdOrderByUpdatedTimeAsc(id);

		LocalDate estimatedDelivery = orderService.getEstimatedDelivery(order);

		Map<String, Object> response = new HashMap<>();
		response.put("order", new OrderDto(order));
		response.put("step", stepNumber(order.getStatus()));
		response.put("estimatedDelivery", estimatedDelivery);
		response.put("history", history.stream().map(h -> Map.of(
				"status", h.getStatus(),
				"updatedTime", h.getUpdatedTime(),
				"updatedBy", h.getUpdatedBy()
		)).toList());

		return response;
	}

	@PostMapping("/{id}/cancel")
	public OrderDto cancel(@PathVariable Long id, @RequestBody Map<String, String> body) {

		String reason = body.getOrDefault("reason", "Not specified");

		Order order = orderService.cancelOrder(id, reason);

		return new OrderDto(order);
	}

	private int stepNumber(OrderStatus status) {
		return switch (status) {
			case PLACED -> 1;
			case CONFIRMED -> 2;
			case PREPARING -> 3;
			case PACKED -> 4;
			case SHIPPED -> 5;
			case OUT_FOR_DELIVERY -> 6;
			case DELIVERED -> 7;
			case CANCELLED -> -1;
			default -> 0;
		};
	}
}
