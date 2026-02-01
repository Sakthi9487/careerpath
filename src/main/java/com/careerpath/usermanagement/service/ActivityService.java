package com.careerpath.usermanagement.service;

import org.springframework.stereotype.Service;

import com.careerpath.usermanagement.model.ActivityType;
import com.careerpath.usermanagement.model.User;
import com.careerpath.usermanagement.model.UserActivity;
import com.careerpath.usermanagement.repository.UserActivityRepository;

@Service
public class ActivityService {

    private final UserActivityRepository userActivityRepository;

    public ActivityService(UserActivityRepository userActivityRepository) {
        this.userActivityRepository = userActivityRepository;
    }

    public void logActivity(User user, ActivityType type, String description) {

        UserActivity activity = new UserActivity();
        activity.setUser(user);
        activity.setType(type);
        activity.setDescription(description);

        userActivityRepository.save(activity);
    }
}
