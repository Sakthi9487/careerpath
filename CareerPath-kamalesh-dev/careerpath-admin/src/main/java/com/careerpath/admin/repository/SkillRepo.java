package com.careerpath.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.careerpath.admin.entity.Skill;

public interface SkillRepo extends JpaRepository<Skill, Long> {
	boolean existsByNameAndCategoryAndLevel(String name, String category, String level);

}
