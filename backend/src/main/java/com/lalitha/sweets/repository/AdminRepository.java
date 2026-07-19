package com.lalitha.sweets.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lalitha.sweets.model.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long>{

	Optional<Admin> findByUsername(String username);
}
