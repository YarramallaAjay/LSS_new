package com.lalitha.sweets.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.lalitha.sweets.security.JwtAuthFilter;
import com.lalitha.sweets.service.AdminUserDetailsService;

/**
 * Security configuration for the REST API.
 *
 * - Storefront endpoints (/api/home, /api/products, /api/cart, /api/checkout,
 *   /api/track, /api/orders) are public. The shopping cart still relies on
 *   the servlet HttpSession (see CartService), so session creation stays on
 *   the default IF_REQUIRED policy - it is only *authentication* that is
 *   stateless (JWT), not the whole filter chain.
 * - /api/admin/** requires a valid JWT with ROLE_ADMIN, issued by
 *   AdminAuthApiController after verifying credentials against the Admin
 *   table (BCrypt-hashed passwords).
 * - CORS origins are read from `app.cors.allowed-origins` so the same jar
 *   can be pointed at a local Vite dev server or a deployed frontend URL
 *   purely through configuration, never a code change.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final AdminUserDetailsService adminUserDetailsService;
	private final JwtAuthFilter jwtAuthFilter;

	@Value("${app.cors.allowed-origins:http://localhost:5173}")
	private String allowedOrigins;

	public SecurityConfig(AdminUserDetailsService adminUserDetailsService, JwtAuthFilter jwtAuthFilter) {
		this.adminUserDetailsService = adminUserDetailsService;
		this.jwtAuthFilter = jwtAuthFilter;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
		provider.setUserDetailsService(adminUserDetailsService);
		provider.setPasswordEncoder(passwordEncoder());
		return provider;
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {

		CorsConfiguration config = new CorsConfiguration();

		List<String> origins = Arrays.stream(allowedOrigins.split(","))
				.map(String::trim)
				.filter(s -> !s.isEmpty())
				.toList();

		config.setAllowedOrigins(origins);
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			.csrf(csrf -> csrf.disable())
			.sessionManagement(session -> session
					.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

			.authorizeHttpRequests(auth -> auth
					.requestMatchers(
							"/api/home/**",
							"/api/products/**",
							"/api/cart/**",
							"/api/checkout/**",
							"/api/track/**",
							"/api/orders/**",
							"/api/admin/auth/login",
							"/actuator/health"
					).permitAll()

					.requestMatchers("/api/admin/**").hasRole("ADMIN")

					.anyRequest().authenticated()
			)

			.httpBasic(basic -> basic.disable())
			.formLogin(form -> form.disable())
			.logout(logout -> logout.disable())

			.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
