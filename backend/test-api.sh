#!/bin/bash

echo "=== Testing Cloud Manager API ==="

# Test 1: Create a VM
echo -e "\n1. Creating VM..."
curl -X POST http://localhost:8080/api/vms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test-vm-1",
    "vcpus": 2,
    "memoryMB": 2048,
    "diskGB": 20
  }'

# Test 2: Get all VMs
echo -e "\n\n2. Getting all VMs..."
curl http://localhost:8080/api/vms

# Test 3: Start VM (replace with actual VM ID from previous response)
echo -e "\n\n3. Starting VM..."
curl -X POST http://localhost:8080/api/vms/1/start

# Test 4: Stop VM
echo -e "\n\n4. Stopping VM..."
curl -X POST http://localhost:8080/api/vms/1/stop

# Test 5: Delete VM
echo -e "\n\n5. Deleting VM..."
curl -X DELETE http://localhost:8080/api/vms/1

echo -e "\n\n=== Test completed ==="