package com.rivals_tracker.backend.auth;

import com.rivals_tracker.backend.user.User;
import com.rivals_tracker.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service // Marks this as a Spring service component
public class AuthService {

    private final UserRepository userRepository;

    @Autowired // Spring injects the UserRepository
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerNewUser(String username, String password) {
        // In a real app: Check if username already exists
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already taken"); // Handle this more gracefully in a real API
        }

        // In a real app: Hash the password before saving!
        User newUser = new User(username, password);

        return userRepository.save(newUser); // Save the new user to the database
    }

    // Simplified login logic (for example purposes)
    public Optional<User> loginUser(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // In a real app: Compare hashed password
            if (user.getPassword().equals(password)) { // DANGER: Plain text password check
                return userOptional; // Login successful
            }
        }
        return Optional.empty(); // Login failed (user not found or password incorrect)
    }
}