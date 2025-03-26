import React from 'react';
import { FaRegUser } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../Redux/AuthSlice';
import "./Navbar.css";

export default function Navbar() {
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
  }
  return (
    <div className='navbar'>
      < div > {user && user.name}</ div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '20%' }}>
        {isAuthenticated && <div onClick={handleLogout}>Logout</div>}
        <div>{isAuthenticated ? <FaRegUser onClick={() => navigate('/admin')} /> : <p onClick={() => navigate('/register')}>Register</p>}</div>
      </div >
    </div>
  )
}
