package com.lalitha.sweets.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.lalitha.sweets.dto.DashboardStatsDto;
import com.lalitha.sweets.repository.OrderRepository;
import com.lalitha.sweets.service.AdminDashboardService;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardApiController {

	private final AdminDashboardService dashboardService;
	private final OrderRepository orderRepository;

	public AdminDashboardApiController(AdminDashboardService dashboardService, OrderRepository orderRepository) {
		this.dashboardService = dashboardService;
		this.orderRepository = orderRepository;
	}

	@GetMapping
	public DashboardStatsDto dashboard() {

		DashboardStatsDto dto = new DashboardStatsDto();

		dto.setTotalOrders(dashboardService.getTotalOrders());
		dto.setTotalRevenue(nullToZero(dashboardService.getTotalRevenue()));
		dto.setPendingOrders(dashboardService.getPendingOrders());
		dto.setTodayOrders(dashboardService.getTodayOrders());
		dto.setTodayRevenue(nullToZero(dashboardService.getTodayRevenue()));

		int[] monthlyData = new int[12];
		for (Object[] row : orderRepository.getMonthlyOrders()) {
			int month = (int) row[0];
			int count = ((Long) row[1]).intValue();
			monthlyData[month - 1] = count;
		}
		dto.setMonthlyOrders(monthlyData);

		List<DashboardStatsDto.TopProduct> topProducts = new ArrayList<>();
		for (Object[] row : dashboardService.getTopSellingProducts()) {
			topProducts.add(new DashboardStatsDto.TopProduct((String) row[0], (Long) row[1]));
		}
		dto.setTopProducts(topProducts);

		return dto;
	}

	private double nullToZero(Double value) {
		return value == null ? 0d : value;
	}
}
