package com.careerpath.admin.controller;

import com.careerpath.admin.dto.JobCreateRequest;
import com.careerpath.admin.dto.JobResponse;
import com.careerpath.admin.dto.JobUpdateRequest;
import com.careerpath.admin.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin

public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','JOB_ADMIN')")
    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody JobCreateRequest request) {
        try {
            return ResponseEntity.ok(jobService.createJob(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','JOB_ADMIN')")
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveJob(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(jobService.approveJob(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','JOB_ADMIN')")
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectJob(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(jobService.rejectJob(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','JOB_ADMIN')")
    @PutMapping("/{id}/revoke")
    public ResponseEntity<?> revokeJob(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(jobService.revokeJob(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','JOB_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(jobService.getJobById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','JOB_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody JobUpdateRequest request) {
        try {
            return ResponseEntity.ok(jobService.updateJob(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','JOB_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(jobService.softDeleteJob(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','JOB_ADMIN')")
    @GetMapping("/pending")
    public ResponseEntity<List<JobResponse>> getPendingJobs() {
        return ResponseEntity.ok(jobService.getPendingJobs());
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> getApprovedJobs() {
        return ResponseEntity.ok(jobService.getApprovedJobsForUsers());
    }
}
