package com.lalitha.sweets.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.web.bind.annotation.*;
import com.lalitha.sweets.model.Product;
import com.lalitha.sweets.model.ProductPrice;
import com.lalitha.sweets.repository.ProductPriceRepository;
import com.lalitha.sweets.repository.ProductRepository;
import com.lalitha.sweets.service.CartService;

/**
 * The cart is intentionally still backed by the servlet HttpSession
 * (see CartService, @SessionScope) rather than JWT/localStorage - it is
 * anonymous, guest-checkout state, not something that needs to survive
 * a browser switch. The React client must send requests with
 * `credentials: "include"` so the JSESSIONID cookie round-trips.
 */
@RestController
@RequestMapping("/api/cart")
public class CartApiController {

    private final ProductRepository productRepository;
    private final ProductPriceRepository productPriceRepository;
    private final CartService cartService;

    public CartApiController(
            ProductRepository productRepository,
            ProductPriceRepository productPriceRepository,
            CartService cartService) {

        this.productRepository = productRepository;
        this.productPriceRepository = productPriceRepository;
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public Map<String, Object> addToCart(
            @RequestParam Long productId,
            @RequestParam Long priceId,
            @RequestParam(defaultValue = "1") int quantity) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Product not found"));

        ProductPrice price = productPriceRepository.findById(priceId)
                .orElseThrow(() -> new NoSuchElementException("Price option not found"));

        cartService.addTocart(product, price, quantity);

        return getCart();
    }

    @GetMapping
    public Map<String, Object> getCart() {

        Map<String, Object> response = new HashMap<>();

        response.put("items", cartService.getItems());
        response.put("total", cartService.getTotal());
        response.put("count", cartService.getCartCount());

        return response;
    }

    @PostMapping("/update")
    public Map<String, Object> updateCart(
            @RequestParam Long productId,
            @RequestParam Long priceId,
            @RequestParam int quantity) {

        cartService.updateQuantity(productId, priceId, quantity);
        return getCart();
    }

    @PostMapping("/remove")
    public Map<String, Object> removeItem(
            @RequestParam Long productId,
            @RequestParam Long priceId) {

        cartService.remove(productId, priceId);
        return getCart();
    }

    @PostMapping("/clear")
    public Map<String, Object> clearCart() {
        cartService.clear();
        return getCart();
    }
}
