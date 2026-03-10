package com.careerpath.usermanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.careerpath")
@EntityScan(basePackages = "com.careerpath")
@EnableJpaRepositories(basePackages = "com.careerpath")
public class CareerPathApplication {

    public static void main(String[] args) {
        SpringApplication.run(CareerPathApplication.class, args);
    }
}
