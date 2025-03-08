package com.rivals_tracker.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/api/test")
    public String testEndpoint() {
        return "Endpoint test message";
    }
}
