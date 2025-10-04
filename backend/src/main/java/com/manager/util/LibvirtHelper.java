package com.manager.util;

import org.springframework.stereotype.Component;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;

@Component
public class LibvirtHelper {
    private final String baseImagePath = "/home/imad/Desktop/debian-12-generic-amd64.qcow2";
    private final String vmDisksPath = "/home/imad/vm-disks";
    private final String cloudInitPath = "/home/imad/cloud-init";
    
    public LibvirtHelper() {
        // Create necessary directories
        new File(vmDisksPath).mkdirs();
        new File(cloudInitPath).mkdirs();
    }
    
    public boolean createVM(String name, int vcpus, int memoryMB, int diskGB) {
        try {
            System.out.println("Creating VM: " + name);
            
            // 1. Create disk image
            String diskPath = vmDisksPath + "/" + name + ".qcow2";
            if (!createDiskImage(diskPath, diskGB)) {
                return false;
            }
            
            // 2. Create cloud-init ISO
            String isoPath = vmDisksPath + "/" + name + "-cloud-init.iso";
            if (!createCloudInitISO(name, isoPath)) {
                return false;
            }
            
            // 3. Create VM using virsh command
            String xmlTemplate = generateVMXML(name, vcpus, memoryMB, diskPath, isoPath);
            String xmlFile = "/tmp/" + name + ".xml";
            Files.write(Paths.get(xmlFile), xmlTemplate.getBytes());
            
            // Define and start VM
            ProcessBuilder definePb = new ProcessBuilder("virsh", "define", xmlFile);
            Process defineProcess = definePb.start();
            int defineExit = defineProcess.waitFor();
            
            ProcessBuilder startPb = new ProcessBuilder("virsh", "start", name);
            Process startProcess = startPb.start();
            int startExit = startProcess.waitFor();
            
            // Clean up temp file
            new File(xmlFile).delete();
            
            return defineExit == 0 && startExit == 0;
            
        } catch (Exception e) {
            System.err.println("Error creating VM: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
    private boolean createDiskImage(String diskPath, int diskGB) {
        try {
            if (!new File(baseImagePath).exists()) {
                System.err.println("Base image not found: " + baseImagePath);
                return false;
            }
            
            ProcessBuilder pb = new ProcessBuilder(
                "qemu-img", "create", "-f", "qcow2",
                "-b", baseImagePath, "-F", "qcow2",
                diskPath, diskGB + "G"
            );
            
            Process process = pb.start();
            int exitCode = process.waitFor();
            
            if (exitCode != 0) {
                // Read error stream
                BufferedReader errorReader = new BufferedReader(
                    new InputStreamReader(process.getErrorStream())
                );
                String line;
                while ((line = errorReader.readLine()) != null) {
                    System.err.println("qemu-img error: " + line);
                }
            }
            
            return exitCode == 0;
            
        } catch (Exception e) {
            System.err.println("Error creating disk image: " + e.getMessage());
            return false;
        }
    }
    
    private boolean createCloudInitISO(String vmName, String isoPath) {
        try {
            // Create cloud-init directory for this VM
            String vmCloudInitDir = cloudInitPath + "/" + vmName;
            new File(vmCloudInitDir).mkdirs();
            
            // Create user-data
            String userData = """
                #cloud-config
                hostname: %s
                manage_etc_hosts: true
                users:
                  - name: debian
                    sudo: ALL=(ALL) NOPASSWD:ALL
                    groups: users, sudo
                    shell: /bin/bash
                    lock_passwd: false
                    passwd: $6$rounds=4096$NQ.EmIrGxn$rTvGsI3dREZhEqxREFehlpcHpSEgAZWN5VrSYrZx1eXubxpZ1Vq7Tpg2SJaqpWV0RlqDp3aFqYFJYzSGFpilL0
                ssh_pwauth: true
                disable_root: false
                chpasswd:
                  list: |
                    debian:debian
                  expire: false
                packages:
                  - qemu-guest-agent
                runcmd:
                  - systemctl enable qemu-guest-agent
                  - systemctl start qemu-guest-agent
                """.formatted(vmName);
            
            Files.write(Paths.get(vmCloudInitDir + "/user-data"), userData.getBytes());
            
            // Create meta-data
            String metaData = "instance-id: " + vmName + "\nlocal-hostname: " + vmName + "\n";
            Files.write(Paths.get(vmCloudInitDir + "/meta-data"), metaData.getBytes());
            
            // Create ISO
            ProcessBuilder pb = new ProcessBuilder(
                "genisoimage", "-output", isoPath,
                "-volid", "cidata", "-joliet", "-rock",
                vmCloudInitDir + "/user-data",
                vmCloudInitDir + "/meta-data"
            );
            
            Process process = pb.start();
            int exitCode = process.waitFor();
            
            return exitCode == 0;
            
        } catch (Exception e) {
            System.err.println("Error creating cloud-init ISO: " + e.getMessage());
            return false;
        }
    }
    
    private String generateVMXML(String name, int vcpus, int memoryMB, String diskPath, String isoPath) {
        return """
            <domain type='kvm'>
                <name>%s</name>
                <memory unit='MiB'>%d</memory>
                <vcpu placement='static'>%d</vcpu>
                <os>
                    <type arch='x86_64'>hvm</type>
                    <boot dev='hd'/>
                </os>
                <features>
                    <acpi/>
                    <apic/>
                </features>
                <cpu mode='host-passthrough'/>
                <clock offset='utc'/>
                <on_poweroff>destroy</on_poweroff>
                <on_reboot>restart</on_reboot>
                <on_crash>destroy</on_crash>
                <devices>
                    <emulator>/usr/bin/qemu-system-x86_64</emulator>
                    <disk type='file' device='disk'>
                        <driver name='qemu' type='qcow2'/>
                        <source file='%s'/>
                        <target dev='vda' bus='virtio'/>
                    </disk>
                    <disk type='file' device='cdrom'>
                        <driver name='qemu' type='raw'/>
                        <source file='%s'/>
                        <target dev='sda' bus='sata'/>
                        <readonly/>
                    </disk>
                    <interface type='network'>
                        <source network='default'/>
                        <model type='virtio'/>
                    </interface>
                    <graphics type='vnc' port='-1' listen='0.0.0.0'/>
                    <video>
                        <model type='qxl'/>
                    </video>
                </devices>
            </domain>
            """.formatted(name, memoryMB, vcpus, diskPath, isoPath);
    }
    
    public boolean deleteVM(String name) {
        try {
            // Stop VM if running
            new ProcessBuilder("virsh", "destroy", name).start().waitFor();
            
            // Undefine VM
            ProcessBuilder undefinePb = new ProcessBuilder("virsh", "undefine", name);
            Process undefineProcess = undefinePb.start();
            int undefineExit = undefineProcess.waitFor();
            
            // Delete disk files
            String diskPath = vmDisksPath + "/" + name + ".qcow2";
            String isoPath = vmDisksPath + "/" + name + "-cloud-init.iso";
            String cloudInitDir = cloudInitPath + "/" + name;
            
            new File(diskPath).delete();
            new File(isoPath).delete();
            deleteDirectory(new File(cloudInitDir));
            
            return undefineExit == 0;
            
        } catch (Exception e) {
            System.err.println("Error deleting VM: " + e.getMessage());
            return false;
        }
    }
    
    public boolean startVM(String name) {
        try {
            ProcessBuilder pb = new ProcessBuilder("virsh", "start", name);
            Process process = pb.start();
            return process.waitFor() == 0;
        } catch (Exception e) {
            System.err.println("Error starting VM: " + e.getMessage());
            return false;
        }
    }
    
    public boolean stopVM(String name) {
        try {
            ProcessBuilder pb = new ProcessBuilder("virsh", "destroy", name);
            Process process = pb.start();
            return process.waitFor() == 0;
        } catch (Exception e) {
            System.err.println("Error stopping VM: " + e.getMessage());
            return false;
        }
    }
    
    public boolean restartVM(String name) {
        try {
            ProcessBuilder pb = new ProcessBuilder("virsh", "reboot", name);
            Process process = pb.start();
            return process.waitFor() == 0;
        } catch (Exception e) {
            System.err.println("Error restarting VM: " + e.getMessage());
            return false;
        }
    }
    
    private void deleteDirectory(File directory) {
        if (directory.exists()) {
            File[] files = directory.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isDirectory()) {
                        deleteDirectory(file);
                    } else {
                        file.delete();
                    }
                }
            }
            directory.delete();
        }
    }
}