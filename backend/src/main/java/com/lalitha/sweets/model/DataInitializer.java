package com.lalitha.sweets.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.lalitha.sweets.repository.AdminRepository;

import jakarta.annotation.PostConstruct;

/**
 * Seeds the first admin user on a fresh database so there is a way to log
 * into /api/admin/auth/login before any admin exists. The username and
 * password both come from environment variables (see .env.example) - never
 * hardcode credentials here.
 */
@Component
public class DataInitializer {

	private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

	@Autowired
	private AdminRepository adminRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Value("${app.admin.default-username:admin}")
	private String defaultUsername;

	@Value("${app.admin.default-password:}")
	private String defaultPassword;

	@PostConstruct
	public void createAdmin() {

		if (adminRepository.findByUsername(defaultUsername).isPresent()) {
			return;
		}

		String password = defaultPassword;

		if (password == null || password.isBlank()) {
			// No ADMIN_DEFAULT_PASSWORD provided: generate one so the app
			// still boots, but make it impossible to miss in the logs
			// instead of silently shipping a known default like "admin123".
			password = java.util.UUID.randomUUID().toString().substring(0, 12);
			log.warn("=================================================================");
			log.warn("No ADMIN_DEFAULT_PASSWORD set - generated a one-time admin password.");
			log.warn("Username: {}", defaultUsername);
			log.warn("Password: {}", password);
			log.warn("Set ADMIN_DEFAULT_PASSWORD in your environment to control this.");
			log.warn("=================================================================");
		}

		Admin admin = new Admin();
		admin.setUsername(defaultUsername);
		admin.setPassword(passwordEncoder.encode(password));
		admin.setRole("ADMIN");

		adminRepository.save(admin);
	}
}
