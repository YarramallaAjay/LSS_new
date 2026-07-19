package com.lalitha.sweets.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.lalitha.sweets.model.Order;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

	@Autowired
	private JavaMailSender mailSender;

	@Value("${spring.mail.username}")
	private String fromAddress;

	@Value("${app.frontend.base-url}")
	private String frontendBaseUrl;

	@Value("${app.backend.base-url}")
	private String backendBaseUrl;

	public void sendOrderConfirmation(Order order, String subject, String trackUrl, byte[] pdfBytes) {

		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);

			String resolvedTrackUrl = trackUrl != null ? trackUrl : (frontendBaseUrl + "/track/" + order.getId());

			helper.setFrom(fromAddress);
			helper.setTo(order.getCustomer().getEmail());
			helper.setSubject(subject);

			String html = """
			<div style="font-family: Arial; background:#0f172a; color:white; padding:20px;">

			    <h2 style="color:#22c55e;">🎉 Order Details!</h2>

			    <p>Hi <b>%s</b>,</p>

			    <p>Your order has been placed successfully.</p>

			    <div style="background:#1e293b; padding:15px; border-radius:10px;">
			        <p><b>Order ID:</b> #%d</p>
			        <p><b>Total Amount:</b> ₹%s</p>
			        <p><b>Status:</b> %s</p>
			        <p><b>Delivery Address:</b><br>%s</p>
			    </div>

			    <br>

			    <a href="%s" style="
			        display:inline-block;
			        padding:12px 20px;
			        background:#22c55e;
			        color:white;
			        text-decoration:none;
			        border-radius:5px;
			    ">View / Track Order</a>

			    <br><br>

			    <p>We’ll notify you when your order is shipped 🚚</p>

			    <p>Thank you for choosing <b>Lalitha Surya Sweets</b> ❤️</p>

			</div>
			""".formatted(
					order.getCustomerNameSnapshot(),
					order.getId(),
					order.getTotalAmount(),
					order.getStatus(),
					order.getAddress(),
					resolvedTrackUrl
			);

			helper.setText(html, true);

			if (pdfBytes != null) {
				helper.addAttachment("invoice-" + order.getId() + ".pdf", new ByteArrayResource(pdfBytes));
			}

			mailSender.send(message);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void sendStatusUpdate(Order order) {

		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);

			String trackUrl = frontendBaseUrl + "/track/" + order.getId();
			String invoiceUrl = backendBaseUrl + "/api/checkout/invoice/" + order.getId();

			helper.setFrom(fromAddress);
			helper.setTo(order.getCustomer().getEmail());
			helper.setSubject("📦 Order #" + order.getId() + " Status Update");

			String htmlContent = """
			    <div style="font-family:Arial; padding:15px;">

			        <h2 style="color:#d35400;">🍬 Lalitha Surya Sweets</h2>

			        <p>Hello <b>%s</b>,</p>

			        <p>Your order status is now:</p>

			        <h3 style="color:green;">%s</h3>

			        <p>
			            📍 <b>Track your order:</b><br>
			            <a href="%s">Click here to track</a>
			        </p>

			        <p>
			            📄 <b>Download Invoice:</b><br>
			            <a href="%s">Download Invoice</a>
			        </p>

			        <br>

			        <p>Thank you for choosing us ❤️</p>

			        <p style="color:gray; font-size:12px;">
			            Lalitha Surya Sweets<br>
			            Fresh & Traditional Taste
			        </p>

			    </div>
			    """.formatted(
					order.getCustomerNameSnapshot(),
					order.getStatus(),
					trackUrl,
					invoiceUrl
			);

			helper.setText(htmlContent, true);

			mailSender.send(message);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
