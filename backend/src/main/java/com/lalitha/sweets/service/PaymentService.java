package com.lalitha.sweets.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public Order createOrder(Double amount) throws Exception {

        RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();

        // Razorpay amount should be in paise
        orderRequest.put("amount", amount * 100);

        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_123456");

        return razorpay.orders.create(orderRequest);
    }

    public String getKeyId() {
        return razorpayKeyId;
    }
}