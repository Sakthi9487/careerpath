package com.careerpath.usermanagement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.careerpath.usermanagement.dto.RegisterRequest;
import com.careerpath.usermanagement.service.AuthService;
import com.careerpath.usermanagement.dto.LoginRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {

        boolean success = authService.login(request);

        if (!success) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        return ResponseEntity.ok("Login successful");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestParam String email) {
        authService.logout(email);
        return ResponseEntity.ok("Logout successful");
    }
}
