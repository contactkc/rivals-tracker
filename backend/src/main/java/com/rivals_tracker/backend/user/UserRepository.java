package com.rivals_tracker.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

// JpaRepository<[Entity Type], [Primary Key Type]>
public interface UserRepository extends JpaRepository<User, UUID> {

    // Custom method to find a user by username
    Optional<User> findByUsername(String username);

    // Custom method to find a user by Marvel Rivals username (optional)
    Optional<User> findByMarvelRivalsUsername(String marvelRivalsUsername);
}