package com.careerpath.usermanagement.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.careerpath.usermanagement.model.User;
import com.careerpath.usermanagement.model.UserAchievement;
import com.careerpath.usermanagement.repository.UserAchievementRepository;

@Service
public class AchievementService {

    private final UserAchievementRepository userAchievementRepository;

    public AchievementService(UserAchievementRepository userAchievementRepository) {
        this.userAchievementRepository = userAchievementRepository;
    }

  
    public void evaluateAndGrant(User user,
                                 int overallSkillProgress,
                                 int coursesCompleted,
                                 int jobsApplied) {

        Set<String> existingTitles =
                userAchievementRepository.findByUser(user)
                        .stream()
                        .map(a -> a.getTitle().toLowerCase())
                        .collect(Collectors.toSet());

       
        if (overallSkillProgress >= 10) {
            awardIfMissing(user, existingTitles,
                    "First Skill Started", "first-skill.png");
        }

        if (overallSkillProgress >= 40) {
            awardIfMissing(user, existingTitles,
                    "Consistency Starter", "consistency.png");
        }

        if (overallSkillProgress >= 70) {
            awardIfMissing(user, existingTitles,
                    "Skill Pro", "skill-pro.png");
        }

        if (coursesCompleted >= 1) {
            awardIfMissing(user, existingTitles,
                    "First Course Completed", "first-course.png");
        }


        if (jobsApplied >= 1) {
            awardIfMissing(user, existingTitles,
                    "First Job Application", "first-job.png");
        }
    }

   
    private void awardIfMissing(User user,
                                Set<String> existingTitles,
                                String title,
                                String icon) {

        if (existingTitles.contains(title.toLowerCase())) {
            return;
        }

        UserAchievement achievement = new UserAchievement();
        achievement.setUser(user);
        achievement.setTitle(title);
        achievement.setIcon(icon);

        userAchievementRepository.save(achievement);
    }

    
    public List<UserAchievement> getAchievementsForUser(User user) {
        return userAchievementRepository.findByUser(user);
    }
}
