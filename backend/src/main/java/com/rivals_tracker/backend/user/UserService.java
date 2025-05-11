package com.rivals_tracker.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<User> findById(UUID id) {
        return userRepository.findById(id);
    }
    
    /**
     * Update a user's username
     */
    public Optional<User> updateUsername(UUID userId, String newUsername) {
        // Check if username is already taken
        if (userRepository.findByUsername(newUsername).isPresent()) {
            throw new IllegalArgumentException("Username already taken");
        }
        
        return userRepository.findById(userId)
            .map(user -> {
                user.setUsername(newUsername);
                return userRepository.save(user);
            });
    }
    
    /**
     * Update a user's password
     */
    public Optional<User> updatePassword(UUID userId, String newPassword) {
        return userRepository.findById(userId)
            .map(user -> {
                // Encode the password before saving
                user.setPassword(passwordEncoder.encode(newPassword));
                return userRepository.save(user);
            });
    }
    
    /**
     * Update a user's Marvel Rivals username
     * accepts null to remove the username
     */
    public Optional<User> updateMarvelRivalsUsername(UUID userId, String newMarvelUsername) {
        return userRepository.findById(userId)
            .map(user -> {
                user.setMarvelRivalsUsername(newMarvelUsername);
                return userRepository.save(user);
            });
    }

    /**
     * Delete a user account
     * @param userId The ID of the user to delete
     * @return true if the user was deleted, false if the user wasn't found
     */
    public boolean deleteUser(UUID userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
            return true;
        }
        return false;
    }
}