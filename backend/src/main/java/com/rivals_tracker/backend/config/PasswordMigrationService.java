package com.rivals_tracker.backend.config;

import com.rivals_tracker.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordMigrationService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public PasswordMigrationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        userRepository.findAll().forEach(user -> {
            // check if the password is not already hashed
            if (!user.getPassword().startsWith("$2a$")) { // BCrypt prefix check
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                userRepository.save(user);
            }
        });
    }
}