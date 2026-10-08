package com.gershon.watches.controller;

import com.gershon.watches.model.Watch;
import com.gershon.watches.repository.WatchRepository;
import com.gershon.watches.service.StripeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class WatchController {

    private final WatchRepository watchRepository;
    private final StripeService stripeService;

    public WatchController(WatchRepository watchRepository, StripeService stripeService) {
        this.watchRepository = watchRepository;
        this.stripeService = stripeService;
    }

    // Get all watches
    @GetMapping("/watches")
    public List<Watch> getAllWatches() {
        return watchRepository.findAllByOrderByCreatedAtDesc();
    }

    // Post a new watch (price can be null!)
    @PostMapping("/watches")
    public ResponseEntity<Watch> createWatch(@RequestBody Watch watch) {
        Watch saved = watchRepository.save(watch);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Delete a watch by ID
    @DeleteMapping("/watches/{id}")
    public ResponseEntity<Void> deleteWatch(@PathVariable Long id) {
        if (!watchRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        watchRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Create Stripe Payment Intent
    @PostMapping("/checkout/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody Map<String, Object> payload) {
        BigDecimal amount = new BigDecimal(payload.get("amount").toString());
        String currency = (String) payload.getOrDefault("currency", "eur");
        Map<String, String> result = stripeService.createPaymentIntent(amount, currency);
        return ResponseEntity.ok(result);
    }
}
