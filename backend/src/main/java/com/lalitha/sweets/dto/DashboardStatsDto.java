package com.lalitha.sweets.dto;

import java.util.List;

public class DashboardStatsDto {

	private long totalOrders;
	private double totalRevenue;
	private long pendingOrders;
	private long todayOrders;
	private double todayRevenue;
	private int[] monthlyOrders;
	private List<TopProduct> topProducts;

	public static class TopProduct {
		private String name;
		private long unitsSold;

		public TopProduct(String name, long unitsSold) {
			this.name = name;
			this.unitsSold = unitsSold;
		}

		public String getName() {
			return name;
		}

		public long getUnitsSold() {
			return unitsSold;
		}
	}

	public long getTotalOrders() {
		return totalOrders;
	}

	public void setTotalOrders(long totalOrders) {
		this.totalOrders = totalOrders;
	}

	public double getTotalRevenue() {
		return totalRevenue;
	}

	public void setTotalRevenue(double totalRevenue) {
		this.totalRevenue = totalRevenue;
	}

	public long getPendingOrders() {
		return pendingOrders;
	}

	public void setPendingOrders(long pendingOrders) {
		this.pendingOrders = pendingOrders;
	}

	public long getTodayOrders() {
		return todayOrders;
	}

	public void setTodayOrders(long todayOrders) {
		this.todayOrders = todayOrders;
	}

	public double getTodayRevenue() {
		return todayRevenue;
	}

	public void setTodayRevenue(double todayRevenue) {
		this.todayRevenue = todayRevenue;
	}

	public int[] getMonthlyOrders() {
		return monthlyOrders;
	}

	public void setMonthlyOrders(int[] monthlyOrders) {
		this.monthlyOrders = monthlyOrders;
	}

	public List<TopProduct> getTopProducts() {
		return topProducts;
	}

	public void setTopProducts(List<TopProduct> topProducts) {
		this.topProducts = topProducts;
	}
}
