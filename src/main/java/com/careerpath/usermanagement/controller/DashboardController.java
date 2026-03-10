package com.careerpath.usermanagement.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.careerpath.usermanagement.model.User;
import com.careerpath.usermanagement.model.UserSkill;
import com.careerpath.usermanagement.repository.UserRepository;
import com.careerpath.usermanagement.repository.UserSkillRepository;
import com.careerpath.usermanagement.repository.UserActivityRepository;
import com.careerpath.usermanagement.model.UserActivity;
import com.careerpath.usermanagement.model.UserAchievement;
import com.careerpath.usermanagement.repository.UserAchievementRepository;
import com.careerpath.usermanagement.dto.DashboardSummaryResponse;
import com.careerpath.usermanagement.service.DashboardService;
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse getDashboardSummary(Authentication authentication) {
        return dashboardService.getDashboard(authentication);
    }

    @GetMapping("/skills")
    public List<UserSkill> getUserSkills(Authentication authentication) {
        return dashboardService.getSkills(authentication);
    }

    @GetMapping("/activities")
    public List<UserActivity> getActivities(Authentication authentication) {
        return dashboardService.getActivities(authentication);
    }

    @GetMapping("/achievements")
    public List<UserAchievement> getAchievements(Authentication authentication) {
        return dashboardService.getAchievements(authentication);
    }
}
