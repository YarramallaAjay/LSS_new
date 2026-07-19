package com.lalitha.sweets.service;


import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.lalitha.sweets.model.Admin;
import com.lalitha.sweets.repository.AdminRepository;



@Service
public class AdminUserDetailsService implements UserDetailsService{

	@Autowired
	private AdminRepository adminRepository;

	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		Admin admin = adminRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("Admin not found"));
		
		return User.builder()
				.username(admin.getUsername())
				.password(admin.getPassword())
				.roles(admin.getRole())
				.build();
	}
	
}
