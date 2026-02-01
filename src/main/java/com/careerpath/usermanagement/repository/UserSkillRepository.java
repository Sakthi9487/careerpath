package com.careerpath.usermanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careerpath.usermanagement.model.UserSkill;
import com.careerpath.usermanagement.model.User;


public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUser(User user);
}
