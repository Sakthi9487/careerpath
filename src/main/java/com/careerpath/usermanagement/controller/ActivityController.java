package com.careerpath.usermanagement.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.careerpath.usermanagement.model.ActivityType;
import com.careerpath.usermanagement.model.User;
import com.careerpath.usermanagement.repository.UserRepository;
import com.careerpath.usermanagement.service.ActivityService;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    private final ActivityService activityService;
    private final UserRepository userRepository;

    public ActivityController(ActivityService activityService,
                              UserRepository userRepository) {
        this.activityService = activityService;
        this.userRepository = userRepository;
    }
    @PostMapping("/log")
    public String logActivity(@RequestParam ActivityType type,
                              @RequestParam String description,
                              Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        activityService.logActivity(user, type, description);

        return "Activity logged successfully";
    }
}
