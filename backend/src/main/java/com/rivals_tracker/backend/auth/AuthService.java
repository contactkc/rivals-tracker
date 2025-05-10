package com.rivals_tracker.backend.auth;

import com.rivals_tracker.backend.user.User;
import com.rivals_tracker.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service // Marks this as a Spring service component
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired // Spring injects the UserRepository and PasswordEncoder
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerNewUser(String username, String password) {
        // checks if username already exists
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already taken");
        }

        // hash the password with BCrypt before saving
        String hashedPassword = passwordEncoder.encode(password);
        User newUser = new User(username, hashedPassword);

        return userRepository.save(newUser); // save the new user to the database
    }

    // login logic (for example purposes)
    public Optional<User> loginUser(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // compare user input password with stored hash
            if (passwordEncoder.matches(password, user.getPassword())) {
                return userOptional; // successful
            }
        }
        return Optional.empty(); // failed (user not found or password incorrect)
    }
}