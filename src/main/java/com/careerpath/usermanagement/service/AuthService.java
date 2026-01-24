package com.careerpath.usermanagement.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.careerpath.usermanagement.dto.LoginRequest;
import com.careerpath.usermanagement.dto.RegisterRequest;
import com.careerpath.usermanagement.model.User;
import com.careerpath.usermanagement.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // REGISTER
    public void register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole().toUpperCase());
        user.setLoggedIn(false);

        userRepository.save(user);
    }

    // LOGIN
    public boolean login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return false;
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return false;
        }

        user.setLoggedIn(true);
        user.setLastLoginAt(LocalDateTime.now());
        user.setLastLogoutAt(null);

        userRepository.save(user);
        return true;
    }

    // LOGOUT
    public void logout(String email) {

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setLoggedIn(false);
        user.setLastLogoutAt(LocalDateTime.now());

        userRepository.save(user);
    }
}
