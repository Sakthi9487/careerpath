package com.careerpath.admin.user.controller;

import com.careerpath.admin.user.service.TutorialCompletionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tutorials")
public class TutorialCompletionController {

    private final TutorialCompletionService completionService;

    public TutorialCompletionController(TutorialCompletionService completionService) {
        this.completionService = completionService;
    }

    /**
     * Mark a skill's tutorial as completed.
     */
    @PostMapping("/complete/{skillId}")
    public ResponseEntity<?> markCompleted(@PathVariable Long skillId,
            Authentication authentication) {
        completionService.markCompleted(authentication, skillId);
        return ResponseEntity.ok(Map.of("message", "Tutorial marked as completed", "skillId", skillId));
    }

    /**
     * Get all completed skill IDs for the authenticated user.
     */
    @GetMapping("/completed")
    public ResponseEntity<List<Long>> getCompletedSkills(Authentication authentication) {
        return ResponseEntity.ok(completionService.getCompletedSkillIds(authentication));
    }

    /**
     * Check if a specific skill's tutorial is completed.
     */
    @GetMapping("/completed/{skillId}")
    public ResponseEntity<Map<String, Object>> isCompleted(@PathVariable Long skillId,
            Authentication authentication) {
        boolean completed = completionService.isSkillCompleted(authentication, skillId);
        return ResponseEntity.ok(Map.of("skillId", skillId, "completed", completed));
    }
}
