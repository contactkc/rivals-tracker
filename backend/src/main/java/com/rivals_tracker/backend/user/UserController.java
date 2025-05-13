package com.rivals_tracker.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.util.Optional;

@RestController
@RequestMapping("/api/users") // Base path for user-related endpoints
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable UUID userId) {
        Optional<User> userOptional = userService.findById(userId);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @PutMapping("/{userId}/username")
    public ResponseEntity<?> updateUsername(
            @PathVariable UUID userId,
            @RequestBody UpdateUsernameRequest request) {
        return userService.updateUsername(userId, request.username)
            .map(user -> ResponseEntity.ok().build())
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}/password")
    public ResponseEntity<?> updatePassword(
            @PathVariable UUID userId,
            @RequestBody UpdatePasswordRequest request) {
        return userService.updatePassword(userId, request.password)
            .map(user -> ResponseEntity.ok().build())
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}/marvel-username")
    public ResponseEntity<?> updateMarvelRivalsUsername(
            @PathVariable UUID userId,
            @RequestBody UpdateMarvelUsernameRequest request) {
        return userService.updateMarvelRivalsUsername(userId, request.marvelRivalsUsername)
            .map(user -> ResponseEntity.ok().build())
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID userId) {
        try {
            boolean deleted = userService.deleteUser(userId);
            if (deleted) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred while deleting the user: " + e.getMessage());
        }
    }
}

// Request Body DTOs
class UpdateUsernameRequest {
    public String username;
}

class UpdatePasswordRequest {
    public String password;
}

class UpdateMarvelUsernameRequest {
    public String marvelRivalsUsername;
}