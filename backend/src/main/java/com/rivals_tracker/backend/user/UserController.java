package com.rivals_tracker.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.util.Optional;

// Request Body DTO for updating Marvel Rivals username
class UpdateMarvelUsernameRequest {
    public String marvelRivalsUsername;
}

@RestController
@RequestMapping("/api/users") // Base path for user-related endpoints
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Endpoint to update the Marvel Rivals username for a specific user
    // PUT is often used for updating resources
    @PutMapping("/{userId}/marvel-username")
    public ResponseEntity<?> updateMarvelRivalsUsername(
            @PathVariable UUID userId, // Get the user ID from the URL path
            @RequestBody UpdateMarvelUsernameRequest request) { // Get the new username from the request body

        // In a real app, you'd verify the authenticated user is the one making the request
        // to prevent users from updating others' profiles.

        Optional<User> updatedUserOptional = userService.updateMarvelRivalsUsername(userId, request.marvelRivalsUsername);

        if (updatedUserOptional.isPresent()) {
            // In a real app, return a DTO without the password
            return new ResponseEntity<>(updatedUserOptional.get(), HttpStatus.OK); // 200 OK
        } else {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND); // 404 Not Found
        }
    }

    // Optional: Endpoint to get user details (excluding sensitive info)
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable UUID userId) {
         Optional<User> userOptional = userService.findById(userId);

         if (userOptional.isPresent()) {
             User user = userOptional.get();
             // In a real app, map this to a UserResponse DTO to exclude the password
             return new ResponseEntity<>(user, HttpStatus.OK);
         } else {
             return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
         }
    }
}