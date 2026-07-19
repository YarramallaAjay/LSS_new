package com.lalitha.sweets.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;


@Entity
@Table(name="orders")
public class Order {

	@Id
	@GeneratedValue(strategy =  GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "order_date")
	private LocalDateTime orderDate;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private OrderStatus status;
	
	@Column(nullable = false, length = 1000)
	private String address;
	
	@Column(nullable = false)
	private String state;
	
	@Column(nullable = false)
    private String customerNameSnapshot;

    @Column(nullable = false)
    private String customerPhoneSnapshot;
    
    @Column(length = 255)
    private String cancelReason;
	
    private BigDecimal totalAmount;
	private BigDecimal handlingCharges;
	private BigDecimal deliveryCharges;
	private BigDecimal subtotal;
    
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "customer_id")
	public Customer customer;
	
	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private List<OrderItem> items = new ArrayList<>();


	
	
	
	private LocalDate estimatedDeliveryDate;
	
	private LocalDateTime lastUpdatedAt;

	private String paymentId;
	
	@Column(name = "razorpay_order_id")
	private String razorpayOrderId;

	@Column(name = "razorpay_payment_id")
	private String razorpayPaymentId;

	@Column(name = "razorpay_signature")
	private String razorpaySignature;

	@Enumerated(EnumType.STRING)
	@Column(name = "payment_status")
	private PaymentStatus paymentStatus;
	

	public Long getId() {return id;}
	public void setId(Long id) {this.id = id;}


	public BigDecimal getTotalAmount() {return totalAmount;}
	public void setTotalAmount(BigDecimal totalAmount) {this.totalAmount = totalAmount;}


	public LocalDateTime getOrderDate() {return orderDate;}
	public void setOrderDate(LocalDateTime orderDate) {this.orderDate = orderDate;}


	public List<OrderItem> getItems() {return items;}
	public void setItems(List<OrderItem> items) {this.items = items;}
	
	
	public OrderStatus getStatus() {return status;}
	public void setStatus(OrderStatus status) {this.status = status;}
	public Object findById(Long id2) {
		// TODO Auto-generated method stub
		return null;
	}
	
	public void setCustomer(Customer customer) {
		// TODO Auto-generated method stub
		this.customer = customer;
	}
	
	public Customer getCustomer() {
		return customer;
	}
	
	
	public BigDecimal getHandlingCharges() {
		return handlingCharges;
	}
	public void setHandlingCharges(BigDecimal handlingCharges) {
		this.handlingCharges = handlingCharges;
	}
	public BigDecimal getDeliveryCharges() {
		return deliveryCharges;
	}
	public void setDeliveryCharges(BigDecimal deliveryCharges) {
		this.deliveryCharges = deliveryCharges;
	}
	public BigDecimal getSubtotal() {
		return subtotal;
	}
	public void setSubtotal(BigDecimal subtotal) {
		this.subtotal = subtotal;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	
	
	
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public LocalDate getEstimatedDeliveryDate() {
		return estimatedDeliveryDate;
	}
	public void setEstimatedDeliveryDate(LocalDate estimatedDeliveryDate) {
		this.estimatedDeliveryDate = estimatedDeliveryDate;
	}
	public LocalDateTime getLastUpdatedAt() {
		return lastUpdatedAt;
	}
	public void setLastUpdatedAt(LocalDateTime lastUpdatedAt) {
		this.lastUpdatedAt = lastUpdatedAt;
	}
	public String getCustomerNameSnapshot() {
		return customerNameSnapshot;
	}
	public void setCustomerNameSnapshot(String customerNameSnapshot) {
		this.customerNameSnapshot = customerNameSnapshot;
	}
	public String getCustomerPhoneSnapshot() {
		return customerPhoneSnapshot;
	}
	public void setCustomerPhoneSnapshot(String customerPhoneSnapshot) {
		this.customerPhoneSnapshot = customerPhoneSnapshot;
	}
	public String getCancelReason() {
		return cancelReason;
	}
	public void setCancelReason(String cancelReason) {
		this.cancelReason = cancelReason;
	}
	public void setPaymentId(String paymentId) {
		// TODO Auto-generated method stub
		this.paymentId = paymentId;
		
	}
	public void setPaymentStatus(PaymentStatus paymentStatus) {
		// TODO Auto-generated method stub
		this.paymentStatus = paymentStatus;
	}
	public String getRazorpayOrderId() {
		return razorpayOrderId;
	}
	public void setRazorpayOrderId(String razorpayOrderId) {
		this.razorpayOrderId = razorpayOrderId;
	}
	public String getRazorpayPaymentId() {
		return razorpayPaymentId;
	}
	public void setRazorpayPaymentId(String razorpayPaymentId) {
		this.razorpayPaymentId = razorpayPaymentId;
	}
	public String getRazorpaySignature() {
		return razorpaySignature;
	}
	public void setRazorpaySignature(String razorpaySignature) {
		this.razorpaySignature = razorpaySignature;
	}
	public String getPaymentId() {
		return paymentId;
	}
	public PaymentStatus getPaymentStatus() {
		return paymentStatus;
	}
	
	
	
	
	
	
}
