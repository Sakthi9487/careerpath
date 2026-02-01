package com.careerpath.usermanagement.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.careerpath.usermanagement.dto.DashboardSummaryResponse;
import com.careerpath.usermanagement.model.ActivityType;
import com.careerpath.usermanagement.model.User;
import com.careerpath.usermanagement.model.UserActivity;
import com.careerpath.usermanagement.model.UserAchievement;
import com.careerpath.usermanagement.model.UserSkill;
import com.careerpath.usermanagement.repository.UserActivityRepository;
import com.careerpath.usermanagement.repository.UserRepository;
import com.careerpath.usermanagement.repository.UserSkillRepository;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserActivityRepository userActivityRepository;
    private final AchievementService achievementService;

    public DashboardService(UserRepository userRepository,
                            UserSkillRepository userSkillRepository,
                            UserActivityRepository userActivityRepository,
                            AchievementService achievementService) {

        this.userRepository = userRepository;
        this.userSkillRepository = userSkillRepository;
        this.userActivityRepository = userActivityRepository;
        this.achievementService = achievementService;
    }

    private User resolveUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public DashboardSummaryResponse getDashboard(Authentication authentication) {

        User user = resolveUser(authentication);

       
        List<UserSkill> skills = userSkillRepository.findByUser(user);

        int overallSkillProgress = skills.isEmpty() ? 0 :
                (int) skills.stream()
                        .mapToInt(UserSkill::getProgress)
                        .average()
                        .orElse(0);

        String skillLevel =
                overallSkillProgress < 40 ? "Beginner" :
                overallSkillProgress < 70 ? "Intermediate" :
                "Advanced";

        Map<String, Integer> skillProgress =
                skills.stream()
                        .collect(Collectors.toMap(
                                UserSkill::getSkillName,
                                UserSkill::getProgress,
                                (a, b) -> b
                        ));

        List<UserActivity> activities =
                userActivityRepository.findByUserOrderByCreatedAtDesc(user);

        Set<LocalDate> activeDays =
                activities.stream()
                        .map(a -> a.getCreatedAt().toLocalDate())
                        .collect(Collectors.toSet());

        int learningStreak = 0;
        LocalDate day = LocalDate.now();

        while (activeDays.contains(day)) {
            learningStreak++;
            day = day.minusDays(1);
        }

        int coursesCompleted = (int) activities.stream()
                .filter(a -> a.getType() == ActivityType.COURSE_COMPLETE)
                .count();

        int jobsApplied = (int) activities.stream()
                .filter(a -> a.getType() == ActivityType.JOB_APPLIED)
                .count();

        achievementService.evaluateAndGrant(
                user,
                overallSkillProgress,
                coursesCompleted,
                jobsApplied
        );

        return new DashboardSummaryResponse(
                user.getUsername(),
                learningStreak,
                coursesCompleted,
                jobsApplied,
                skillLevel,
                overallSkillProgress,
                skillProgress
        );
    }

   

    public List<UserSkill> getSkills(Authentication authentication) {
        User user = resolveUser(authentication);
        return userSkillRepository.findByUser(user);
    }

    public List<UserActivity> getActivities(Authentication authentication) {
        User user = resolveUser(authentication);
        return userActivityRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<UserAchievement> getAchievements(Authentication authentication) {
        User user = resolveUser(authentication);
        return achievementService.getAchievementsForUser(user);
    }
}
