package com.careerpath.usermanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/auth/**",
                    "/",
                    "/register.html",
                    "/login.html",
                    "/Landing.html",
                    "/api/public/**",
                    "/roadmap.html",
                    "/reference.html",
                   
                    "/tutorials.html",
                    "/runner.html",
                    "/dashboard.html",

                 
                    "/css/**",
                    "/js/**",
                    "/assets/**",

                    // OAuth
                    "/oauth2/**",
                    "/login/**",
                    "/login/oauth2/**"
                ).permitAll()

                .anyRequest().authenticated()
            )

            .oauth2Login(oauth ->
                oauth.defaultSuccessUrl("/home.html", true)
            );

        return http.build();
    }
}
