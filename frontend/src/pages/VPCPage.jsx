import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VPCPage = () => {
  const [vpcs, setVpcs] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newVPC, setNewVPC] = useState({
    name: '',
    cidr_block: '192.168.100.0/24'
  });

  useEffect(() => {
    fetchVPCs();
  }, []);

  const fetchVPCs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vpcs');
      setVpcs(response.data.vpcs || []);
    } catch (error) {
      console.error('Error fetching VPCs:', error);
      alert('Error fetching VPCs');
    }
  };

  const createVPC = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/vpcs', newVPC);
      setShowCreateForm(false);
      setNewVPC({ name: '', cidr_block: '192.168.100.0/24' });
      fetchVPCs();
      alert('VPC created successfully');
    } catch (error) {
      console.error('Error creating VPC:', error);
      alert('Error creating VPC');
    }
  };

  const deleteVPC = async (vpcName) => {
    if (window.confirm(`Are you sure you want to delete VPC ${vpcName}?`)) {
      try {
        // This would need to be implemented in the backend
        alert('Delete functionality needs backend implementation');
      } catch (error) {
        console.error('Error deleting VPC:', error);
        alert('Error deleting VPC');
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Virtual Private Clouds (VPCs)</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          Create VPC
        </button>
      </div>

      {showCreateForm && (
        <div className="card mt-4">
          <div className="card-header">
            <h5>Create New VPC</h5>
          </div>
          <div className="card-body">
            <form onSubmit={createVPC}>
              <div className="mb-3">
                <label className="form-label">VPC Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newVPC.name}
                  onChange={(e) => setNewVPC({...newVPC, name: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">CIDR Block</label>
                <input
                  type="text"
                  className="form-control"
                  value={newVPC.cidr_block}
                  onChange={(e) => setNewVPC({...newVPC, cidr_block: e.target.value})}
                  required
                  placeholder="192.168.100.0/24"
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">Create</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateForm(false)}
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
                <th>Bridge</th>
                <th>Status</th>
                <th>Auto Start</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vpcs.map(vpc => (
                <tr key={vpc.name}>
                  <td>{vpc.name}</td>
                  <td>{vpc.bridge}</td>
                  <td>
                    <span className={`badge ${vpc.active ? 'bg-success' : 'bg-secondary'}`}>
                      {vpc.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{vpc.autostart ? 'Yes' : 'No'}</td>
                  <td>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteVPC(vpc.name)}
                    >
                      Delete
                    </button>
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

export default VPCPage;