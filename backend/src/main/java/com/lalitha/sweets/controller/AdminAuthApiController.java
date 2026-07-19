package com.lalitha.sweets.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import com.lalitha.sweets.dto.LoginRequest;
import com.lalitha.sweets.model.Admin;
import com.lalitha.sweets.repository.AdminRepository;
import com.lalitha.sweets.security.JwtService;

import jakarta.validation.Valid;

/**
 * Issues JWTs for the admin SPA. This replaces the old Spring Security
 * formLogin flow (session + login page rendered by Thymeleaf) now that the
 * frontend is a separate React app: the client POSTs credentials once and
 * attaches the returned token as "Authorization: Bearer <token>" on every
 * subsequent /api/admin/** call.
 */
@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthApiController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private AdminRepository adminRepository;

	@Autowired
	private JwtService jwtService;

	@PostMapping("/login")
	public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(
							request.getUsername(),
							request.getPassword()
					)
			);
		} catch (BadCredentialsException ex) {
			Map<String, String> error = new HashMap<>();
			error.put("message", "Invalid username or password");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
		}

		Admin admin = adminRepository.findByUsername(request.getUsername())
				.orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

		String token = jwtService.generateToken(admin.getUsername(), admin.getRole());

		Map<String, Object> response = new HashMap<>();
		response.put("token", token);
		response.put("username", admin.getUsername());
		response.put("role", admin.getRole());

		return ResponseEntity.ok(response);
	}
}
