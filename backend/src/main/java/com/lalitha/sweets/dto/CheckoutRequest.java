package com.lalitha.sweets.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CheckoutRequest(
        @NotBlank String name,
        @NotBlank String phone,
        @NotBlank @Email String email,
        @NotBlank String address,
        String city,
        @NotBlank String state,
        @NotBlank String pincode
) {}
