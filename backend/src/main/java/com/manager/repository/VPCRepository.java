package com.manager.repository;

import com.manager.domain.VPC;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VPCRepository extends JpaRepository<VPC, Long> {
    Optional<VPC> findByName(String name);
    boolean existsByName(String name);
}