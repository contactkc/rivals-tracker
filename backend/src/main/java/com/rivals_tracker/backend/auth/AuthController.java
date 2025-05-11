package com.rivals_tracker.backend.auth;

import com.rivals_tracker.backend.security.JwtUtils;
import com.rivals_tracker.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
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
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthController(AuthService authService, JwtUtils jwtUtils) {
        this.authService = authService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/signup") // Handles POST requests to /api/auth/signup
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signupRequest) {
        try {
            User registeredUser = authService.registerNewUser(signupRequest.username, signupRequest.password);
            
            // Create response without password
            User sanitizedUser = new User();
            sanitizedUser.setId(registeredUser.getId());
            sanitizedUser.setUsername(registeredUser.getUsername());
            sanitizedUser.setMarvelRivalsUsername(registeredUser.getMarvelRivalsUsername());
            
            return new ResponseEntity<>(sanitizedUser, HttpStatus.CREATED); // 201 Created
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
            Optional<User> userOptional = authService.loginUser(loginRequest.username, loginRequest.password);

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                String token = jwtUtils.generateToken(user);
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("id", user.getId());
                response.put("username", user.getUsername());
                response.put("marvelRivalsUsername", user.getMarvelRivalsUsername());
                response.put("lastLogin", user.getLastLogin());
                
                return new ResponseEntity<>(response, HttpStatus.OK); // 200 OK
            } else {
                return new ResponseEntity<>("Invalid username or password", HttpStatus.UNAUTHORIZED); // 401 Unauthorized
            }
        } catch (Exception e) {
             // Catch any other unexpected errors
             return new ResponseEntity<>("An error occurred during login", HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }
}