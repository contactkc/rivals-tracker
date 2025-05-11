package com.rivals_tracker.backend.user;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity // Marks this class as a JPA entity to be mapped to a database table
@Table(name = "app_users") // Specify the table name (optional, defaults to class name)
public class User {

    @Id // Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.AUTO) // Database generates the ID
    private UUID id; // Using UUID for unique identifiers

    @Column(nullable = false, unique = true) // Ensures username is not null and is unique
    private String username;

    @Column(nullable = false) // Password cannot be null
    private String password; // Remember to hash this in a real app!

    @Column(unique = true) // Marvel Rivals username should be unique (optional, depends on requirements)
    private String marvelRivalsUsername; // Field to store the game username

    @Column
    private LocalDateTime lastLogin;  // field for tracking last login

    // Constructors (Lombok's @Data can generate a default constructor)
    // JPA requires a no-argument constructor
    public User() {
    }

    // JPA requires a no-argument constructor
    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // --- Getters ---
    public UUID getId() {
        return this.id;
    }
    
    public String getUsername() {
        return this.username; 
    }

    public String getPassword() {
        return this.password;
    }

    public String getMarvelRivalsUsername() {
        return this.marvelRivalsUsername;
    }

    public LocalDateTime getLastLogin() {
        return this.lastLogin;
    }

    // --- Setters ---
    // Note: Typically you wouldn't have a setter for the auto-generated ID
    public void setId(UUID id) { this.id = id; } // Avoid this setter for generated IDs

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setMarvelRivalsUsername(String marvelRivalsUsername) {
        this.marvelRivalsUsername = marvelRivalsUsername;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }
    // Optional: You might also want to generate equals(), hashCode(), and toString() methods
    // using your IDE's built-in features for better object comparison and debugging.
}