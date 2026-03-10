package com.careerpath.usermanagement.service;

import java.util.*;
import org.springframework.stereotype.Service;

import com.careerpath.usermanagement.dto.FeaturedCourseDTO;
import com.careerpath.usermanagement.model.Course;
import com.careerpath.usermanagement.repository.CourseRepository;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<FeaturedCourseDTO> getFeaturedCourses() {

        List<Course> courses = courseRepository.findAll();
        List<FeaturedCourseDTO> result = new ArrayList<>();

        for (Course c : courses) {
            result.add(new FeaturedCourseDTO(
                    c.getTitle(),
                    c.getDescription(),
                    c.getLevel(),
                    c.getType()
            ));
        }
        return result;
    }

    public List<FeaturedCourseDTO> searchCourses(String keyword) {

        if (keyword == null || keyword.trim().isEmpty()) {
            return getFeaturedCourses();
        }

        List<Course> courses =
                courseRepository
                        .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                                keyword, keyword
                        );

        List<FeaturedCourseDTO> result = new ArrayList<>();

        for (Course c : courses) {
            result.add(new FeaturedCourseDTO(
                    c.getTitle(),
                    c.getDescription(),
                    c.getLevel(),
                    c.getType()
            ));
        }

        return result;
    }
}
