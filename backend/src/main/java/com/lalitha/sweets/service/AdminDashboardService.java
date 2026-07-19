package com.lalitha.sweets.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lalitha.sweets.model.OrderStatus;
import com.lalitha.sweets.repository.OrderItemRepository;
import com.lalitha.sweets.repository.OrderRepository;

@Service
public class AdminDashboardService {

	@Autowired
	private OrderRepository orderRepository;
	
	@Autowired
	private OrderItemRepository orderItemRepository;
	
	public long getTotalOrders() {
		return orderRepository.countTotalOrders();
	}
	
	
	public Double getTotalRevenue() {
		return orderRepository.totalRevenue();
	}
	
	public long getPendingOrders() {
		return orderRepository.countByStatus(OrderStatus.PLACED);
	}
	
	
	public long getTodayOrders() {
		return orderRepository.countTodayOrders();
	}
	
	
	public List<Object[]> getMonthlyOrders(){
		return orderRepository.monthlyOrders();
	}
	
	public Double getTodayRevenue() {
		return orderRepository.todayRevenue();
	}
	
	public List<Object[]> getTopSellingProducts(){
		return orderItemRepository.getTopSellingProducts();
	}
	
}
