package com.lalitha.sweets.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.lalitha.sweets.model.Order;
import com.lalitha.sweets.model.OrderStatus;
import com.lalitha.sweets.model.PaymentStatus;

/**
 * Flat, self-contained view of an Order for API responses.
 *
 * The Order/Customer JPA entities reference each other (Order.customer and
 * Customer.orders), so serializing the entities directly would either blow
 * up with infinite recursion or leak a lazy proxy depending on
 * open-in-view. Mapping to this DTO keeps the API contract explicit and
 * avoids that entirely.
 */
public class OrderDto {

	private Long id;
	private LocalDateTime orderDate;
	private OrderStatus status;
	private List<OrderStatus> nextAllowedStatuses;
	private String address;
	private String state;
	private String customerNameSnapshot;
	private String customerPhoneSnapshot;
	private String cancelReason;
	private BigDecimal totalAmount;
	private BigDecimal handlingCharges;
	private BigDecimal deliveryCharges;
	private BigDecimal subtotal;
	private CustomerDto customer;
	private List<OrderItemDto> items;
	private LocalDate estimatedDeliveryDate;
	private LocalDateTime lastUpdatedAt;
	private String paymentId;
	private String razorpayOrderId;
	private PaymentStatus paymentStatus;

	public OrderDto() {
	}

	public OrderDto(Order order) {
		this.id = order.getId();
		this.orderDate = order.getOrderDate();
		this.status = order.getStatus();
		this.nextAllowedStatuses = order.getStatus() != null ? order.getStatus().nextAllowedStatuses() : List.of();
		this.address = order.getAddress();
		this.state = order.getState();
		this.customerNameSnapshot = order.getCustomerNameSnapshot();
		this.customerPhoneSnapshot = order.getCustomerPhoneSnapshot();
		this.cancelReason = order.getCancelReason();
		this.totalAmount = order.getTotalAmount();
		this.handlingCharges = order.getHandlingCharges();
		this.deliveryCharges = order.getDeliveryCharges();
		this.subtotal = order.getSubtotal();
		this.customer = new CustomerDto(order.getCustomer());
		this.items = order.getItems() == null ? List.of() : order.getItems().stream().map(OrderItemDto::new).toList();
		this.estimatedDeliveryDate = order.getEstimatedDeliveryDate();
		this.lastUpdatedAt = order.getLastUpdatedAt();
		this.paymentId = order.getPaymentId();
		this.razorpayOrderId = order.getRazorpayOrderId();
		this.paymentStatus = order.getPaymentStatus();
	}

	public Long getId() {
		return id;
	}

	public LocalDateTime getOrderDate() {
		return orderDate;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public List<OrderStatus> getNextAllowedStatuses() {
		return nextAllowedStatuses;
	}

	public String getAddress() {
		return address;
	}

	public String getState() {
		return state;
	}

	public String getCustomerNameSnapshot() {
		return customerNameSnapshot;
	}

	public String getCustomerPhoneSnapshot() {
		return customerPhoneSnapshot;
	}

	public String getCancelReason() {
		return cancelReason;
	}

	public BigDecimal getTotalAmount() {
		return totalAmount;
	}

	public BigDecimal getHandlingCharges() {
		return handlingCharges;
	}

	public BigDecimal getDeliveryCharges() {
		return deliveryCharges;
	}

	public BigDecimal getSubtotal() {
		return subtotal;
	}

	public CustomerDto getCustomer() {
		return customer;
	}

	public List<OrderItemDto> getItems() {
		return items;
	}

	public LocalDate getEstimatedDeliveryDate() {
		return estimatedDeliveryDate;
	}

	public LocalDateTime getLastUpdatedAt() {
		return lastUpdatedAt;
	}

	public String getPaymentId() {
		return paymentId;
	}

	public String getRazorpayOrderId() {
		return razorpayOrderId;
	}

	public PaymentStatus getPaymentStatus() {
		return paymentStatus;
	}
}
