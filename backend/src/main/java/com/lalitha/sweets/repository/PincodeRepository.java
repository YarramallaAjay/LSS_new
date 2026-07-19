package com.lalitha.sweets.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lalitha.sweets.model.PincodeData;


public interface PincodeRepository extends JpaRepository<PincodeData, Long>{
	Optional<PincodeData> findByPincode(String pincode);
}
