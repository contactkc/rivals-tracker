package com.rivals_tracker.backend.security;

import com.rivals_tracker.backend.user.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

@Configuration
public class JwtFilterConfig {
    
    @Bean
    public JwtFilter jwtFilter(JwtUtils jwtUtils, @Lazy UserService userService) {
        return new JwtFilter(jwtUtils, userService);
    }
}