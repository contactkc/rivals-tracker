package com.rivals_tracker.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> updateMarvelRivalsUsername(UUID userId, String marvelRivalsUsername) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setMarvelRivalsUsername(marvelRivalsUsername);
            userRepository.save(user); // Save the updated user
            return Optional.of(user);
        } else {
            return Optional.empty(); // User not found
        }
    }

    public Optional<User> findById(UUID userId) {
        return userRepository.findById(userId);
    }
}