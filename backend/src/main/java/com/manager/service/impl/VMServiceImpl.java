package com.manager.service.impl;

import com.manager.domain.VM;
import com.manager.repository.VMRepository;
import com.manager.service.VMService;
import com.manager.util.LibvirtHelper;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VMServiceImpl implements VMService {
    
    private final VMRepository vmRepository;
    private final LibvirtHelper libvirtHelper;
    
    public VMServiceImpl(VMRepository vmRepository, LibvirtHelper libvirtHelper) {
        this.vmRepository = vmRepository;
        this.libvirtHelper = libvirtHelper;
    }
    
    @Override
    public VM createVM(VM vm) {
        if (vmRepository.existsByName(vm.getName())) {
            throw new RuntimeException("VM with name " + vm.getName() + " already exists");
        }
        
        // Create VM using libvirt
        boolean created = libvirtHelper.createVM(
            vm.getName(), 
            vm.getVcpus(), 
            vm.getMemoryMB(), 
            vm.getDiskGB()
        );
        
        if (created) {
            vm.setStatus("RUNNING");
            return vmRepository.save(vm);
        } else {
            throw new RuntimeException("Failed to create VM " + vm.getName());
        }
    }
    
    @Override
    public List<VM> getAllVMs() {
        return vmRepository.findAll();
    }
    
    @Override
    public VM getVMById(Long id) {
        return vmRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("VM not found with id: " + id));
    }
    
    @Override
    public VM getVMByName(String name) {
        return vmRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("VM not found with name: " + name));
    }
    
    @Override
    public void deleteVM(Long id) {
        VM vm = getVMById(id);
        boolean deleted = libvirtHelper.deleteVM(vm.getName());
        if (deleted) {
            vmRepository.deleteById(id);
        } else {
            throw new RuntimeException("Failed to delete VM " + vm.getName());
        }
    }
    
    @Override
    public VM startVM(Long id) {
        VM vm = getVMById(id);
        boolean started = libvirtHelper.startVM(vm.getName());
        if (started) {
            vm.setStatus("RUNNING");
            return vmRepository.save(vm);
        } else {
            throw new RuntimeException("Failed to start VM " + vm.getName());
        }
    }
    
    @Override
    public VM stopVM(Long id) {
        VM vm = getVMById(id);
        boolean stopped = libvirtHelper.stopVM(vm.getName());
        if (stopped) {
            vm.setStatus("STOPPED");
            return vmRepository.save(vm);
        } else {
            throw new RuntimeException("Failed to stop VM " + vm.getName());
        }
    }
    
    @Override
    public VM restartVM(Long id) {
        VM vm = getVMById(id);
        boolean restarted = libvirtHelper.restartVM(vm.getName());
        if (restarted) {
            vm.setStatus("RUNNING");
            return vmRepository.save(vm);
        } else {
            throw new RuntimeException("Failed to restart VM " + vm.getName());
        }
    }
}