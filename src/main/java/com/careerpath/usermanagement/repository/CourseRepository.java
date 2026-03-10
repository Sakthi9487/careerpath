package com.careerpath.usermanagement.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.careerpath.usermanagement.model.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByTitleContainingIgnoreCase(String keyword);

    List<Course> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String title,
            String description
    );
}
