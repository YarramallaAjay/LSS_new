package com.lalitha.sweets;

import com.lalitha.sweets.model.Admin;
import com.lalitha.sweets.repository.AdminRepository;
import com.lalitha.sweets.security.JwtService;
import com.lalitha.sweets.service.EmailService;
import com.lalitha.sweets.service.PaymentService;
import com.lalitha.sweets.service.WhatsAppService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Full-stack integration tests.
 * Uses H2 (application-test.properties) and mocks external services
 * (email, WhatsApp, Razorpay) so no real network traffic is made.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LalithaSweetsApplicationTests {

    @Autowired MockMvc mockMvc;
    @Autowired AdminRepository adminRepository;
    @Autowired JwtService jwtService;
    @Autowired PasswordEncoder passwordEncoder;

    // Mock external services – avoids real SMTP / WhatsApp / Razorpay calls.
    @MockBean EmailService emailService;
    @MockBean WhatsAppService whatsAppService;
    @MockBean PaymentService paymentService;

    // ── context ───────────────────────────────────────────────────────────────

    @Test
    void contextLoads() {
        // Verifies the entire Spring application context starts without errors.
    }

    // ── public storefront endpoints ───────────────────────────────────────────

    @Test
    void getProducts_publicEndpoint_returns200() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void getProductsByCategory_publicEndpoint_returns200() throws Exception {
        mockMvc.perform(get("/api/products/category/sweets"))
                .andExpect(status().isOk());
    }

    @Test
    void checkoutSummary_publicEndpoint_returns200() throws Exception {
        mockMvc.perform(get("/api/checkout"))
                .andExpect(status().isOk());
    }

    // ── security: admin endpoints require JWT ─────────────────────────────────

    @Test
    void adminDashboard_withoutToken_returns403() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminProducts_withoutToken_returns403() throws Exception {
        mockMvc.perform(get("/api/admin/products"))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminOrders_withoutToken_returns403() throws Exception {
        mockMvc.perform(get("/api/admin/orders"))
                .andExpect(status().isForbidden());
    }

    // ── security: admin endpoints accessible with valid JWT ───────────────────

    @Test
    void adminDashboard_withValidJwt_returns200() throws Exception {
        String token = validAdminJwt();

        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void adminProducts_withValidJwt_returns200() throws Exception {
        String token = validAdminJwt();

        mockMvc.perform(get("/api/admin/products")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    // ── admin login endpoint ──────────────────────────────────────────────────

    @Test
    void adminLogin_invalidCredentials_returns401() throws Exception {
        String body = "{\"username\":\"admin\",\"password\":\"wrong\"}";

        mockMvc.perform(post("/api/admin/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminLogin_validCredentials_returnsToken() throws Exception {
        ensureAdminExists("admin", "admin123");

        String body = "{\"username\":\"admin\",\"password\":\"admin123\"}";

        mockMvc.perform(post("/api/admin/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.username").value("admin"));
    }

    // ── order tracking (public) ───────────────────────────────────────────────

    @Test
    void trackNonExistentOrder_returns404() throws Exception {
        mockMvc.perform(get("/api/orders/99999/track"))
                .andExpect(status().isNotFound());
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    /**
     * Ensures an admin with the given credentials exists in H2 and returns
     * a signed JWT for that admin, allowing authenticated test requests.
     */
    private String validAdminJwt() {
        ensureAdminExists("admin", "admin123");
        return jwtService.generateToken("admin", "ADMIN");
    }

    private void ensureAdminExists(String username, String plainPassword) {
        if (adminRepository.findByUsername(username).isEmpty()) {
            Admin admin = new Admin();
            admin.setUsername(username);
            admin.setPassword(passwordEncoder.encode(plainPassword));
            admin.setRole("ADMIN");
            adminRepository.save(admin);
        }
    }
}
