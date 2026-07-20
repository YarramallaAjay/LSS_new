package com.lalitha.sweets.security;

import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

/**
 * Issues and validates the JWTs used to authenticate the admin SPA against
 * the REST API. The token carries the admin username and role as claims so
 * the API stays fully stateless (no server-side session for /api/admin/**).
 *
 * Uses the jjwt 0.12.x API (Jwts.parser()/verifyWith(), not the removed
 * 0.11.x Jwts.parserBuilder()).
 */
@Service
public class JwtService {

	@Value("${app.jwt.secret}")
	private String secret;

	@Value("${app.jwt.expiration-ms:86400000}")
	private long expirationMs;

	private SecretKey signingKey() {
		// Accepts either a base64-encoded secret or a plain string.
		byte[] keyBytes;
		try {
			keyBytes = Decoders.BASE64.decode(secret);
		} catch (Exception ex) {
			keyBytes = secret.getBytes();
		}
		if (keyBytes.length < 32) {
			// Pad out short dev secrets so HS256 doesn't reject the key at runtime.
			byte[] padded = new byte[32];
			System.arraycopy(keyBytes, 0, padded, 0, Math.min(keyBytes.length, 32));
			keyBytes = padded;
		}
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public String generateToken(String username, String role) {

		Date now = new Date();
		Date expiry = new Date(now.getTime() + expirationMs);

		return Jwts.builder()
				.subject(username)
				.claim("role", role)
				.issuedAt(now)
				.expiration(expiry)
				.signWith(signingKey())
				.compact();
	}

	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}

	public String extractRole(String token) {
		return extractClaim(token, claims -> claims.get("role", String.class));
	}

	public boolean isTokenValid(String token, String expectedUsername) {
		String username = extractUsername(token);
		return username.equals(expectedUsername) && !isTokenExpired(token);
	}

	private boolean isTokenExpired(String token) {
		return extractClaim(token, Claims::getExpiration).before(new Date());
	}

	private <T> T extractClaim(String token, Function<Claims, T> resolver) {
		Claims claims = Jwts.parser()
				.verifyWith(signingKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
		return resolver.apply(claims);
	}

}
