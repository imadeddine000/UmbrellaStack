package com.manager.service;

import com.manager.domain.VM;
import java.util.List;

public interface VMService {
    VM createVM(VM vm);
    List<VM> getAllVMs();
    VM getVMById(Long id);
    VM getVMByName(String name);
    void deleteVM(Long id);
    VM startVM(Long id);
    VM stopVM(Long id);
    VM restartVM(Long id);
}