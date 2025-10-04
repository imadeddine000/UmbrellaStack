import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubnetPage = () => {
  const [subnets, setSubnets] = useState([]);
  const [vpcs, setVpcs] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSubnet, setNewSubnet] = useState({
    vpc_name: '',
    name: '',
    cidr_block: '192.168.101.0/24'
  });

  useEffect(() => {
    fetchSubnets();
    fetchVPCs();
  }, []);

  const fetchSubnets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/subnets');
      setSubnets(response.data.subnets || []);
    } catch (error) {
      console.error('Error fetching subnets:', error);
      alert('Error fetching subnets');
    }
  };

  const fetchVPCs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vpcs');
      setVpcs(response.data.vpcs || []);
    } catch (error) {
      console.error('Error fetching VPCs:', error);
    }
  };

  const createSubnet = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/subnets', newSubnet);
      setShowCreateForm(false);
      setNewSubnet({ vpc_name: '', name: '', cidr_block: '192.168.101.0/24' });
      fetchSubnets();
      alert('Subnet created successfully');
    } catch (error) {
      console.error('Error creating subnet:', error);
      alert('Error creating subnet');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Subnets</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          Create Subnet
        </button>
      </div>

      {showCreateForm && (
        <div className="card mt-4">
          <div className="card-header">
            <h5>Create New Subnet</h5>
          </div>
          <div className="card-body">
            <form onSubmit={createSubnet}>
              <div className="mb-3">
                <label className="form-label">VPC</label>
                <select
                  className="form-control"
                  value={newSubnet.vpc_name}
                  onChange={(e) => setNewSubnet({...newSubnet, vpc_name: e.target.value})}
                  required
                >
                  <option value="">Select VPC</option>
                  {vpcs.map(vpc => (
                    <option key={vpc.name} value={vpc.name}>
                      {vpc.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Subnet Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newSubnet.name}
                  onChange={(e) => setNewSubnet({...newSubnet, name: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">CIDR Block</label>
                <input
                  type="text"
                  className="form-control"
                  value={newSubnet.cidr_block}
                  onChange={(e) => setNewSubnet({...newSubnet, cidr_block: e.target.value})}
                  required
                  placeholder="192.168.101.0/24"
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
              </tr>
            </thead>
            <tbody>
              {subnets.map(subnet => (
                <tr key={subnet.name}>
                  <td>{subnet.name}</td>
                  <td>{subnet.bridge}</td>
                  <td>
                    <span className={`badge ${subnet.active ? 'bg-success' : 'bg-secondary'}`}>
                      {subnet.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{subnet.autostart ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubnetPage;