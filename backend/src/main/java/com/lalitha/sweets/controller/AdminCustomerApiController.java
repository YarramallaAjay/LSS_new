package com.lalitha.sweets.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.lalitha.sweets.dto.CustomerDto;
import com.lalitha.sweets.repository.CustomerRepository;

@RestController
@RequestMapping("/api/admin/customers")
public class AdminCustomerApiController {

	private final CustomerRepository customerRepository;

	public AdminCustomerApiController(CustomerRepository customerRepository) {
		this.customerRepository = customerRepository;
	}

	@GetMapping
	public List<CustomerDto> list() {
		return customerRepository.findAll().stream().map(CustomerDto::new).toList();
	}
}
