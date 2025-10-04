package com.manager.controller;

import com.manager.domain.VM;
import com.manager.service.VMService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vms")
public class VMController {
    
    private final VMService vmService;
    
    public VMController(VMService vmService) {
        this.vmService = vmService;
    }
    
    @PostMapping
    public ResponseEntity<VM> createVM(@RequestBody VM vm) {
        return ResponseEntity.ok(vmService.createVM(vm));
    }
    
    @GetMapping
    public ResponseEntity<List<VM>> getAllVMs() {
        return ResponseEntity.ok(vmService.getAllVMs());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VM> getVM(@PathVariable Long id) {
        return ResponseEntity.ok(vmService.getVMById(id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVM(@PathVariable Long id) {
        vmService.deleteVM(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{id}/start")
    public ResponseEntity<VM> startVM(@PathVariable Long id) {
        return ResponseEntity.ok(vmService.startVM(id));
    }
    
    @PostMapping("/{id}/stop")
    public ResponseEntity<VM> stopVM(@PathVariable Long id) {
        return ResponseEntity.ok(vmService.stopVM(id));
    }
    
    @PostMapping("/{id}/restart")
    public ResponseEntity<VM> restartVM(@PathVariable Long id) {
        return ResponseEntity.ok(vmService.restartVM(id));
    }
}