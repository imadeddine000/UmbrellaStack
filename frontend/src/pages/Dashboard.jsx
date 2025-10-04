import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ vms: 0, vpcs: 0, subnets: 0 });
  const [recentVMs, setRecentVMs] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [vmsRes, vpcsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/vms'),
        axios.get('http://localhost:5000/api/vpcs')
      ]);
      
      setStats({
        vms: vmsRes.data.vms?.length || 0,
        vpcs: vpcsRes.data.vpcs?.length || 0,
        subnets: vpcsRes.data.vpcs?.length || 0
      });
      
      setRecentVMs(vmsRes.data.vms?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Cloud Platform Dashboard</h1>
      
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Virtual Machines</h5>
              <h2 className="card-text">{stats.vms}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">VPCs</h5>
              <h2 className="card-text">{stats.vpcs}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Subnets</h5>
              <h2 className="card-text">{stats.subnets}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Recent Virtual Machines</h5>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>State</th>
                    <th>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVMs.map(vm => (
                    <tr key={vm.uuid}>
                      <td>{vm.name}</td>
                      <td>
                        <span className={`badge ${vm.state === 1 ? 'bg-success' : 'bg-secondary'}`}>
                          {vm.state === 1 ? 'Running' : 'Stopped'}
                        </span>
                      </td>
                      <td>{vm.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;