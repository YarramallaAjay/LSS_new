package com.lalitha.sweets.service;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

import com.lalitha.sweets.model.*;
import com.lalitha.sweets.repository.ProductPriceRepository;
import com.lalitha.sweets.repository.ProductRepository;

import jakarta.servlet.http.HttpSession;

@Service
@SessionScope
public class CartService {

	
	private final ProductRepository productRepository;
	
	@Autowired
	private final ProductPriceRepository productPriceRepository;
	
//	@Autowired
//	private HttpSession httpSession;
	
	private Map<String, CartItem> cart = new LinkedHashMap<>();
	private BigDecimal selectedPrice;
	
	public CartService(ProductRepository productRepository, ProductPriceRepository productPriceRepository) {
	
		this.productRepository = productRepository;
		this.productPriceRepository = productPriceRepository;
	}
	
//	public void addItem(Cart cart, Long productId, Long priceId, int qty) {
//
//        Product product = productRepository.findById(productId)
//                .orElseThrow();
//
//        ProductPrice price = productPriceRepository.findById(priceId)
//                .orElseThrow();
//
//        CartItem item = new CartItem();
//        item.setProduct(product);
//        item.setPrice(price.getPrice());
//        item.setQuantity(qty);
//        
//        cart.getItems().add(item);
//    }
	
	public void addTocart(Product product, ProductPrice price, int qty) {

	    String key = product.getId() + "_" + price.getId();

	    CartItem item = cart.get(key);

	    if (item == null) {

	        item = new CartItem();

	        item.setProduct(product);

	        item.setProductId(product.getId());

	        item.setPriceId(price.getId());

	        item.setProductName(product.getName());

	        item.setPriceLabel(price.getLabel());

	        item.setPrice(price.getPrice());

	        item.setQuantity(qty);

	        item.setImageUrl(product.getImageUrl());

	        cart.put(key, item);
	        

	    } else {

	        item.setQuantity(item.getQuantity() + qty);
	    }
	}

	
	public void updateQuantity(Long productId, Long priceId, int qty) {

	    String key = productId + "_" + priceId;

	    CartItem item = cart.get(key);

	    if (item != null) {

	        if (qty <= 0) {
	            cart.remove(key);
	        } else {
	            item.setQuantity(qty);
	        }
	    }
	}
	
	public void remove(Long productId, Long priceId) {
		cart.remove(productId+ "_" + priceId);
	}
	
	public Collection<CartItem> getItems(){
		return cart.values();
	}
	
	public BigDecimal getTotal() {

	    return cart.values()
	            .stream()
	            .map(CartItem::getSubtotal)
	            .reduce(BigDecimal.ZERO, BigDecimal::add);
	}

	
	public boolean isEmpty() {
		return cart.isEmpty();
	}

	public void clear() {
		// TODO Auto-generated method stub
		cart.clear();
	}

	public int getCartCount() {
		// TODO Auto-generated method stub
		if (cart ==null) {
			return 0;
		}
		
		return cart.size();
	}
}
