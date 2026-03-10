package com.careerpath.usermanagement.dto;

public class ProfileResponse {

    private String username;
    private String email;
    private String role;

    public ProfileResponse(String username, String email, String role) {
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}
