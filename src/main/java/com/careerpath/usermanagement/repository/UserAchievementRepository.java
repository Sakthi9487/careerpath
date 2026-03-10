package com.careerpath.usermanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careerpath.usermanagement.model.User;
import com.careerpath.usermanagement.model.UserAchievement;

public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
    List<UserAchievement> findByUser(User user);
}
