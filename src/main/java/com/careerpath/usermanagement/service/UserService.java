package com.careerpath.usermanagement.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.careerpath.usermanagement.dto.ChangePasswordRequest;
import com.careerpath.usermanagement.dto.ProfileResponse;
import com.careerpath.usermanagement.dto.UpdateProfileRequest;
import com.careerpath.usermanagement.model.User;
import com.careerpath.usermanagement.model.UserProfile;
import com.careerpath.usermanagement.repository.UserProfileRepository;
import com.careerpath.usermanagement.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {
	private final UserProfileRepository userProfileRepository;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
            UserProfileRepository userProfileRepository,
            PasswordEncoder passwordEncoder) {
this.userRepository = userRepository;
this.userProfileRepository = userProfileRepository;
this.passwordEncoder = passwordEncoder;
}


    private User resolveUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ProfileResponse getProfile(Authentication authentication) {
        User user = resolveUser(authentication);

        return new ProfileResponse(
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }

    @Transactional
    public void updateProfile(Authentication authentication,
                              UpdateProfileRequest request) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = userProfileRepository
                .findByUser(user)
                .orElseGet(() -> {
                    UserProfile p = new UserProfile();
                    p.setUser(user);
                    return p;
                });

        profile.setFullName(request.getFullName());
        profile.setPhone(request.getPhone());
        profile.setDob(request.getDob());
        profile.setGender(request.getGender());
        profile.setLocation(request.getLocation());

        userProfileRepository.save(profile);
     
        user.setUsername(request.getFullName());
        userRepository.save(user);

    }


    public void changePassword(Authentication authentication,
                               ChangePasswordRequest request) {

        User user = resolveUser(authentication);

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {
            throw new RuntimeException("Current password incorrect");
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
