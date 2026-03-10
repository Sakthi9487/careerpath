package com.careerpath.usermanagement.controller;

import java.security.Principal;
import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.careerpath.usermanagement.dto.ChangePasswordRequest;
import com.careerpath.usermanagement.dto.ProfileResponse;
import com.careerpath.usermanagement.dto.UpdateProfileRequest;
import com.careerpath.usermanagement.model.User;
import com.careerpath.usermanagement.repository.UserRepository;
import com.careerpath.usermanagement.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository,
                          UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }



    @GetMapping("/profile")
    public ProfileResponse getProfile(Authentication authentication) {
        return userService.getProfile(authentication);
    }

    @PutMapping("/profile")
    public void updateProfile(Authentication authentication,
                              @RequestBody UpdateProfileRequest request) {
        userService.updateProfile(authentication, request);
    }



    @PostMapping("/change-password")
    public void changePassword(Authentication authentication,
                               @RequestBody ChangePasswordRequest request) {
        userService.changePassword(authentication, request);
    }



    @PostMapping("/logout-all")
    public ResponseEntity<String> logoutAll(Principal principal) {

        String email = principal.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setLoggedIn(false);
        user.setLastLogoutAt(LocalDateTime.now());
        userRepository.save(user);

        return ResponseEntity.ok("Logged out from all devices");
    }
}
