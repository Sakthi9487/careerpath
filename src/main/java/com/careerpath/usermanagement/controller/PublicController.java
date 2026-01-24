package com.careerpath.usermanagement.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.careerpath.usermanagement.dto.FeaturedCourseDTO;
import com.careerpath.usermanagement.service.CourseService;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicController {

    private final CourseService courseService;

    public PublicController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/featured-courses")
    public List<FeaturedCourseDTO> getFeaturedCourses() {
        return courseService.getFeaturedCourses();
    }

    @GetMapping("/search")
    public List<FeaturedCourseDTO> searchCourses(@RequestParam String keyword) {
        return courseService.searchCourses(keyword);
    }
}
