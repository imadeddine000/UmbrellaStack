import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VMPage = () => {
  const [vms, setVms] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAdvancedForm, setShowAdvancedForm] = useState(false);
  const [newVM, setNewVM] = useState({
    name: '',
    memory_mb: 2048,
    vcpus: 2,
    disk_size: '10G',
    network: 'default'
  });

  useEffect(() => {
    fetchVMs();
  }, []);

  const fetchVMs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vms');
      setVms(response.data.vms || []);
    } catch (error) {
      console.error('Error fetching VMs:', error);
      alert('Error fetching VMs');
    }
  };

  const createVM = async (e) => {
    e.preventDefault();
    try {
      const endpoint = showAdvancedForm ? '/api/vms/advanced' : '/api/vms';
      await axios.post(`http://localhost:5000${endpoint}`, newVM);
      setShowCreateForm(false);
      setShowAdvancedForm(false);
      setNewVM({ 
        name: '', 
        memory_mb: 2048, 
        vcpus: 2, 
        disk_size: '10G',
        network: 'default' 
      });
      fetchVMs();
      alert('VM created successfully with Debian cloud image');
    } catch (error) {
      console.error('Error creating VM:', error);
      alert('Error creating VM: ' + (error.response?.data?.error || error.message));
    }
  };

  const deleteVM = async (vmName) => {
    if (window.confirm(`Are you sure you want to delete ${vmName}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/vms/${vmName}`);
        fetchVMs();
        alert('VM deleted successfully');
      } catch (error) {
        console.error('Error deleting VM:', error);
        alert('Error deleting VM');
      }
    }
  };

  const restartVM = async (vmName) => {
    try {
      await axios.post(`http://localhost:5000/api/vms/${vmName}/restart`);
      fetchVMs();
      alert('VM restarted successfully');
    } catch (error) {
      console.error('Error restarting VM:', error);
      alert('Error restarting VM');
    }
  };

  const getVMConsole = async (vmName) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/vms/${vmName}/console`);
      const consoleInfo = response.data.console;
      alert(`VNC Console for ${vmName}:\nPort: ${consoleInfo.port}\nConnect using VNC viewer to localhost:${consoleInfo.port}`);
    } catch (error) {
      console.error('Error getting console:', error);
      alert('Error getting console information');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Virtual Machines (Debian Cloud)</h1>
        <div className="btn-group">
          <button 
            className="btn btn-primary"
            onClick={() => {
              setShowCreateForm(true);
              setShowAdvancedForm(false);
            }}
          >
            Quick Create
          </button>
          <button 
            className="btn btn-success"
            onClick={() => {
              setShowCreateForm(true);
              setShowAdvancedForm(true);
            }}
          >
            Advanced Create
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="card mt-4">
          <div className="card-header">
            <h5>
              {showAdvancedForm ? 'Advanced VM Creation (Debian Cloud)' : 'Quick VM Creation (Debian Cloud)'}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={createVM}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">VM Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newVM.name}
                      onChange={(e) => setNewVM({...newVM, name: e.target.value})}
                      required
                      placeholder="debian-vm-01"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Memory (MB)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newVM.memory_mb}
                      onChange={(e) => setNewVM({...newVM, memory_mb: parseInt(e.target.value)})}
                      required
                      min="512"
                      step="256"
                    />
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">vCPUs</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newVM.vcpus}
                      onChange={(e) => setNewVM({...newVM, vcpus: parseInt(e.target.value)})}
                      required
                      min="1"
                      max="16"
                    />
                  </div>
                  
                  {showAdvancedForm && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Disk Size</label>
                        <select
                          className="form-control"
                          value={newVM.disk_size}
                          onChange={(e) => setNewVM({...newVM, disk_size: e.target.value})}
                        >
                          <option value="8G">8 GB</option>
                          <option value="10G">10 GB</option>
                          <option value="20G">20 GB</option>
                          <option value="30G">30 GB</option>
                          <option value="50G">50 GB</option>
                        </select>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Network</label>
                        <select
                          className="form-control"
                          value={newVM.network}
                          onChange={(e) => setNewVM({...newVM, network: e.target.value})}
                        >
                          <option value="default">Default</option>
                          <option value="vpc-network">VPC Network</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="alert alert-info">
                <strong>Note:</strong> This will create a VM using the Debian cloud image with:
                <ul className="mb-0 mt-2">
                  <li>Default user: <code>debian</code></li>
                  <li>Default password: <code>debian</code></li>
                  <li>Cloud-init for automatic configuration</li>
                  <li>SSH enabled with password authentication</li>
                </ul>
              </div>
              
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  Create VM with Debian
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCreateForm(false);
                    setShowAdvancedForm(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card mt-4">
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>State</th>
                <th>vCPUs</th>
                <th>Memory</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vms.map(vm => (
                <tr key={vm.uuid}>
                  <td>
                    <strong>{vm.name}</strong>
                    {vm.persistent && <span className="badge bg-info ms-1">Persistent</span>}
                  </td>
                  <td>
                    <span className={`badge ${vm.state === 1 ? 'bg-success' : 'bg-secondary'}`}>
                      {vm.state_name}
                    </span>
                  </td>
                  <td>{vm.vcpus || 'N/A'}</td>
                  <td>{vm.memory_mb ? `${vm.memory_mb} MB` : 'N/A'}</td>
                  <td>
                    <div className="btn-group">
                      <button 
                        className="btn btn-info btn-sm"
                        onClick={() => getVMConsole(vm.name)}
                        title="VNC Console"
                      >
                        Console
                      </button>
                      <button 
                        className="btn btn-warning btn-sm"
                        onClick={() => restartVM(vm.name)}
                      >
                        Restart
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteVM(vm.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VMPage;