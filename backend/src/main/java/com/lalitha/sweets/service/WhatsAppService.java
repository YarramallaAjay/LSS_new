package com.lalitha.sweets.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.*;

/**
 * Sends WhatsApp notifications through a local bridge (e.g. a
 * whatsapp-web.js gateway) rather than the WhatsApp Cloud API directly.
 * Notifications are best-effort: a failure here (gateway offline, phone
 * unreachable, etc.) must never block placing an order or updating its
 * status, so every call is caught and logged instead of propagated.
 */
@Service
public class WhatsAppService {

	private static final Logger log = LoggerFactory.getLogger(WhatsAppService.class);

	@Value("${whatsapp.gateway.url:http://localhost:3000/send}")
	private String gatewayUrl;

	public void sendWhatsApp(String phone, String message) {

		if (phone == null || phone.isBlank()) {
			return;
		}

		try {
			RestTemplate restTemplate = new RestTemplate();

			Map<String, String> body = new HashMap<>();
			body.put("number", phone);
			body.put("message", message);

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);

			HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

			restTemplate.postForEntity(gatewayUrl, request, String.class);

		} catch (Exception e) {
			log.warn("WhatsApp notification failed for {}: {}", phone, e.getMessage());
		}
	}
}
