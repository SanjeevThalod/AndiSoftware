import { useEffect, useState } from 'react';
import axios from 'axios';
import './PendingUsers.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PendingUsers = () => {
  const pendingUsersSample = [
    {
      _id: "1",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      mobile: "9876543210"
    },
    {
      _id: "2",
      name: "Priya Verma",
      email: "priya.verma@example.com",
      mobile: "9123456780"
    },
    {
      _id: "3",
      name: "Aman Singh",
      email: "aman.singh@example.com",
      mobile: "9012345678"
    },
    {
      _id: "4",
      name: "Sneha Patel",
      email: "sneha.patel@example.com",
      mobile: "9988776655"
    },
    {
      _id: "5",
      name: "Vikram Mehta",
      email: "vikram.mehta@example.com",
      mobile: "9871234560"
    }
  ];
  
  const [pendingUsers, setPendingUsers] = useState([]);

  const fetchPendingUsers = () => {
    axios.get('http://localhost:5000/admin/pending-users')
      .then(res => setPendingUsers(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const approveUser = (userId) => {
    axios.put(`http://localhost:5000/admin/approve-user/${userId}`)
      .then(() => fetchPendingUsers())
      .catch(err => console.error(err));
  };

  const rejectUser = (userId) => {
    axios.delete(`http://localhost:5000/admin/reject-user/${userId}`)
      .then(() => fetchPendingUsers())
      .catch(err => console.error(err));
  };

  return (
    <div className="pending-container">
      <h2 className="heading">Pending User Approvals</h2>

      {pendingUsersSample.length === 0 ? (
        <p className="no-users">No pending users</p>
      ) : (
        <div className="user-list">
          {pendingUsersSample.map(user => (
            <div key={user._id} className="user-card">
              <div className="user-info">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Mobile:</strong> {user.mobile}</p>
              </div>

              <div className="actions">
                <FaCheckCircle 
                  className="icon approve" 
                  onClick={() => approveUser(user._id)} 
                  title="Approve"
                />
                <FaTimesCircle 
                  className="icon reject" 
                  onClick={() => rejectUser(user._id)} 
                  title="Reject"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingUsers;
