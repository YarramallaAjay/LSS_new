package com.lalitha.sweets.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.lalitha.sweets.model.Order;
import com.lalitha.sweets.model.OrderStatus;

/**
 * Interim customer notification channel while the official WhatsApp
 * Business API application (Meta business verification + template
 * approval) is pending - see WhatsAppService for the previous unofficial
 * whatsapp-web.js gateway, which is left in place, unused, so swapping back
 * is a one-line change in AdminOrderApiController/CheckoutApiController
 * once Meta approval comes through.
 *
 * IMPORTANT: Indian carriers require every transactional SMS to use a
 * pre-registered DLT template - whatever text you register with your SMS
 * provider's DLT portal is what actually gets delivered; sending anything
 * that doesn't match an approved template word-for-word gets silently
 * dropped by the telecom operator. Register the draft templates provided
 * alongside this class, then fill in the resulting template IDs below via
 * the sms.template.* properties.
 *
 * NOTE ON THE REQUEST SHAPE: the JSON body built here follows the commonly
 * documented "Flow" API pattern used by providers like MSG91 (authkey
 * header, template_id + recipients array with var1/var2/... placeholders).
 * Confirm the exact endpoint, header name, and field names against
 * whichever provider you actually sign up with before going live - Fast2SMS,
 * Twilio, and others use different request shapes entirely.
 *
 * Notifications are best-effort: a failure here must never block placing
 * an order or updating its status, so every call is caught and logged
 * instead of propagated - same contract as WhatsAppService.
 */
@Service
public class SmsService {

	private static final Logger log = LoggerFactory.getLogger(SmsService.class);

	@Value("${sms.api.url:}")
	private String apiUrl;

	@Value("${sms.api.key:}")
	private String apiKey;

	@Value("${sms.template.paymentConfirmed:}")
	private String templatePaymentConfirmed;

	@Value("${sms.template.confirmed:}")
	private String templateConfirmed;

	@Value("${sms.template.preparing:}")
	private String templatePreparing;

	@Value("${sms.template.packed:}")
	private String templatePacked;

	@Value("${sms.template.shipped:}")
	private String templateShipped;

	@Value("${sms.template.outForDelivery:}")
	private String templateOutForDelivery;

	@Value("${sms.template.delivered:}")
	private String templateDelivered;

	@Value("${sms.template.cancelled:}")
	private String templateCancelled;

	/**
	 * Sends the right DLT-registered template for this order's current
	 * status. Call this from the same spots that used to call
	 * WhatsAppService.sendWhatsApp() - CheckoutApiController.verifyPayment()
	 * (status PLACED) and AdminOrderApiController.notifyCustomer().
	 */
	public void sendOrderStatusSms(Order order, OrderStatus status, String phone, String trackUrl) {

		String name = order.getCustomerNameSnapshot();
		String id = String.valueOf(order.getId());

		switch (status) {
			case PLACED -> sendSms(phone, templatePaymentConfirmed, name, id, String.valueOf(order.getTotalAmount()), trackUrl);
			case CONFIRMED -> sendSms(phone, templateConfirmed, name, id, trackUrl);
			case PREPARING -> sendSms(phone, templatePreparing, name, id);
			case PACKED -> sendSms(phone, templatePacked, name, id, trackUrl);
			case SHIPPED -> sendSms(phone, templateShipped, name, id, trackUrl);
			case OUT_FOR_DELIVERY -> sendSms(phone, templateOutForDelivery, name, id);
			case DELIVERED -> sendSms(phone, templateDelivered, name, id);
			case CANCELLED -> sendSms(phone, templateCancelled, name, id,
					order.getCancelReason() != null && !order.getCancelReason().isBlank() ? order.getCancelReason() : "Not specified");
			default -> { /* NEW/PENDING aren't customer-facing notification points */ }
		}
	}

	/**
	 * Low-level send: posts to the configured SMS gateway with the given
	 * DLT template ID and its variables, in the same order they were
	 * registered in (var1, var2, ...).
	 */
	public void sendSms(String phone, String templateId, String... variables) {

		if (phone == null || phone.isBlank()) {
			return;
		}

		if (apiUrl == null || apiUrl.isBlank() || apiKey == null || apiKey.isBlank() || templateId == null || templateId.isBlank()) {
			log.warn("SMS not sent to {}: sms.api.url/sms.api.key/template id not configured yet", phone);
			return;
		}

		try {
			RestTemplate restTemplate = new RestTemplate();

			JSONObject recipient = new JSONObject();
			recipient.put("mobiles", phone);
			for (int i = 0; i < variables.length; i++) {
				recipient.put("var" + (i + 1), variables[i]);
			}

			JSONObject body = new JSONObject();
			body.put("template_id", templateId);
			body.put("short_url", "0");
			body.put("recipients", new JSONArray().put(recipient));

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);
			headers.set("authkey", apiKey);

			HttpEntity<String> request = new HttpEntity<>(body.toString(), headers);

			restTemplate.postForEntity(apiUrl, request, String.class);

		} catch (Exception e) {
			log.warn("SMS notification failed for {}: {}", phone, e.getMessage());
		}
	}
}
