package com.careerpath.usermanagement.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.careerpath.usermanagement.model.User;
import com.careerpath.usermanagement.model.UserPreference;
import com.careerpath.usermanagement.repository.UserPreferenceRepository;
import com.careerpath.usermanagement.repository.UserRepository;

@RestController
@RequestMapping("/api/user/preferences")
public class UserPreferenceController {

    private final UserRepository userRepo;
    private final UserPreferenceRepository prefRepo;

    public UserPreferenceController(UserRepository userRepo,
                                    UserPreferenceRepository prefRepo) {
        this.userRepo = userRepo;
        this.prefRepo = prefRepo;
    }

    @GetMapping
    public UserPreference getPrefs(Authentication auth) {

        User user = userRepo.findByEmail(auth.getName()).orElseThrow();

        return prefRepo.findByUser(user)
                .orElseGet(() -> {
                    UserPreference p = new UserPreference();
                    p.setUser(user);
                    return prefRepo.save(p);
                });
    }

    @PutMapping
    public void updatePrefs(@RequestBody UserPreference req,
                            Authentication auth) {

        User user = userRepo.findByEmail(auth.getName()).orElseThrow();
        UserPreference pref = prefRepo.findByUser(user).orElseThrow();

        pref.setEmailNotifications(req.isEmailNotifications());
        pref.setPlatformNotifications(req.isPlatformNotifications());
        pref.setJobAlerts(req.isJobAlerts());
        pref.setTheme(req.getTheme());
        pref.setLearningPath(req.getLearningPath());

        prefRepo.save(pref);
    }
}
