package com.VaiDarQuanto.api.repository;

import com.VaiDarQuanto.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}