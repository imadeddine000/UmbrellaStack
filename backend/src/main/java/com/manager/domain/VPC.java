package com.manager.domain;

import lombok.Data;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vpcs")
@Data
public class VPC {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String name;
    
    private String cidrBlock;
    private String status;
    
    @OneToMany(mappedBy = "vpc", cascade = CascadeType.ALL)
    private List<VM> vms = new ArrayList<>();
}