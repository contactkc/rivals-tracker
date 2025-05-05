package com.rivals_tracker.backend.auth;

import com.rivals_tracker.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

// Request Body DTOs (Data Transfer Objects) for signup and login
// Create these simple classes inside or outside this file
class SignupRequest {
    public String username;
    public String password;
}

class LoginRequest {
    public String username;
    public String password;
}

@RestController // Marks this as a REST Controller
@RequestMapping("/api/auth") // Base path for all endpoints in this controller
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup") // Handles POST requests to /api/auth/signup
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        try {
            User registeredUser = authService.registerNewUser(signupRequest.username, signupRequest.password);
            // In a real app, don't return the password! Return a DTO without it.
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED); // 201 Created
        } catch (RuntimeException e) {
            // Handle username already taken error
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST); // 400 Bad Request
        } catch (Exception e) {
             // Catch any other unexpected errors
             return new ResponseEntity<>("An error occurred during registration", HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }

    @PostMapping("/login") // Handles POST requests to /api/auth/login
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
         try {
            // Simplified login - real app needs proper authentication mechanism
            Optional<User> userOptional = authService.loginUser(loginRequest.username, loginRequest.password);

            if (userOptional.isPresent()) {
                 User user = userOptional.get();
                // In a real app: Generate and return a JWT token or session identifier
                // For this example, we'll return the user object (without password in real app)
                return new ResponseEntity<>(user, HttpStatus.OK); // 200 OK
            } else {
                return new ResponseEntity<>("Invalid username or password", HttpStatus.UNAUTHORIZED); // 401 Unauthorized
            }
        } catch (Exception e) {
             // Catch any other unexpected errors
             return new ResponseEntity<>("An error occurred during login", HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }
}