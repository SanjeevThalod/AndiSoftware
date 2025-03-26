import React from 'react';
import { FaRegUser } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import "./Navbar.css";

export default function Navbar() {
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <div className='navbar'>
      <div>{"name"}</div>
      <div>{isAuthenticated ? <FaRegUser onClick={()=>navigate('/admin')}/> : <p onClick={()=>navigate('/register')}>Register</p>}</div>
    </div>
  )
}
