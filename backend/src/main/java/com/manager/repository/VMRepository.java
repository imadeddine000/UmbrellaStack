package com.manager.repository;

import com.manager.domain.VM;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VMRepository extends JpaRepository<VM, Long> {
    Optional<VM> findByName(String name);
    boolean existsByName(String name);
}