package com.lalitha.sweets.security;

import java.io.IOException;
import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Reads the "Authorization: Bearer <token>" header on every request and,
 * when it carries a valid admin JWT, populates the SecurityContext so
 * downstream @PreAuthorize / hasRole checks on /api/admin/** work without
 * any server-side session.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

	private final JwtService jwtService;

	public JwtAuthFilter(JwtService jwtService) {
		this.jwtService = jwtService;
	}

	@Override
	protected void doFilterInternal(
			@NonNull HttpServletRequest request,
			@NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain
	) throws ServletException, IOException {

		String header = request.getHeader("Authorization");

		if (!StringUtils.hasText(header) || !header.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		String token = header.substring(7);

		try {
			String username = jwtService.extractUsername(token);

			if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

				if (jwtService.isTokenValid(token, username)) {

					String role = jwtService.extractRole(token);

					List<SimpleGrantedAuthority> authorities =
							List.of(new SimpleGrantedAuthority("ROLE_" + role));

					UsernamePasswordAuthenticationToken authToken =
							new UsernamePasswordAuthenticationToken(username, null, authorities);

					SecurityContextHolder.getContext().setAuthentication(authToken);
				}
			}
		} catch (Exception ex) {
			// Invalid/expired token: leave the context unauthenticated so the
			// request is rejected downstream with a clean 401/403 instead of a 500.
			SecurityContextHolder.clearContext();
		}

		filterChain.doFilter(request, response);
	}
}
