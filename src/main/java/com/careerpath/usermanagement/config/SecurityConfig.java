package com.careerpath.usermanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.careerpath.usermanagement.security.JwtAuthFilter;
import com.careerpath.usermanagement.security.JwtUtil;

import jakarta.servlet.http.Cookie;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, JwtUtil jwtUtil) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.jwtUtil = jwtUtil;
    }	

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/auth/**",
                    "/",
                    "/login.html",
                    "/register.html",
                    "/Landing.html",
                    "/css/**",
                    "/reference.html",
                    "tutorials.html",
                    "/roadmap.html",
                    "/js/**",
                    "/assets/**",
                    "/oauth2/**",
                    "/login/**",
                    "/login/oauth2/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth -> oauth
                .loginPage("/login.html")
                .successHandler((request, response, authentication) -> {

                    String email = authentication.getName();
                    String token = jwtUtil.generateToken(email);

                    Cookie cookie = new Cookie("AUTH_TOKEN", token);
                    cookie.setHttpOnly(true);
                    cookie.setPath("/");
                    cookie.setMaxAge((int) (jwtUtil.getExpiration() / 1000));

                    response.addCookie(cookie);
                    response.sendRedirect("/dashboard.html");
                })

            )
            .formLogin(form -> form.disable());

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

