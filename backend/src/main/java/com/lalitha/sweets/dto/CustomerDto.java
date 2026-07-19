package com.lalitha.sweets.dto;

import com.lalitha.sweets.model.Customer;

public class CustomerDto {

	private Long id;
	private String name;
	private String email;
	private String phone;
	private String address;
	private String state;
	private String pincode;

	public CustomerDto() {
	}

	public CustomerDto(Customer customer) {
		if (customer == null) {
			return;
		}
		this.id = customer.getId();
		this.name = customer.getName();
		this.email = customer.getEmail();
		this.phone = customer.getPhone();
		this.address = customer.getAddress();
		this.state = customer.getState();
		this.pincode = customer.getPincode();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getPincode() {
		return pincode;
	}

	public void setPincode(String pincode) {
		this.pincode = pincode;
	}
}
