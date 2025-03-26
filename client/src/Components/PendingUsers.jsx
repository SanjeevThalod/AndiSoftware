import { useEffect, useState } from 'react';
import axios from 'axios';
import './PendingUsers.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const PendingUsers = () => {

  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const [pendingUsers, setPendingUsers] = useState([]);

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user',{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPendingUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  }


  const approveUser = async (userId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/user/${userId}/accept`,{},{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      pendingUsers.filter(user => user._id !== userId);
      setPendingUsers(pendingUsers);
      console.log(res);
    } catch (error) {
      console.log(error)
    }
  };

  const rejectUser = async (userId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/user/${userId}/reject`,{},{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      pendingUsers.filter(user => user._id !== userId);
      setPendingUsers(pendingUsers);
      console.log(res)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (true) {
      console.log("changing")
      fetchPendingUsers();
    }
  }, [isAuthenticated, user?.token]);
  return (
    <div className="pending-container">
      <h2 className="heading">Pending User Approvals</h2>

      {pendingUsers.length === 0 ? (
        <p className="no-users">No pending users</p>
      ) : (
        <div className="user-list">
          {pendingUsers.map(user => (
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
