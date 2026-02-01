package com.careerpath.usermanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careerpath.usermanagement.model.User;
import com.careerpath.usermanagement.model.UserActivity;

public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {
    List<UserActivity> findByUserOrderByCreatedAtDesc(User user);
}
