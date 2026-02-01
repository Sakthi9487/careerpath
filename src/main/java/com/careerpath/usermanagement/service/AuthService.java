package com.careerpath.usermanagement.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.careerpath.usermanagement.security.JwtUtil;

import com.careerpath.usermanagement.dto.LoginRequest;
import com.careerpath.usermanagement.dto.RegisterRequest;
import com.careerpath.usermanagement.model.User;
import com.careerpath.usermanagement.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;  

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {   
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;      
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
    public String login(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword().trim();


        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        System.out.println("DB EMAIL: [" + user.getEmail() + "]");
        System.out.println("DB PASSWORD HASH: " + user.getPassword());

        boolean match = passwordEncoder.matches(password, user.getPassword());
        System.out.println("PASSWORD MATCH RESULT: " + match);

        if (!match) {
            throw new RuntimeException("Password mismatch");
        }

     
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return jwtUtil.generateToken(user.getEmail());
    }

    public long getJwtExpiration() {
        return jwtUtil.getExpiration();
    }


}
