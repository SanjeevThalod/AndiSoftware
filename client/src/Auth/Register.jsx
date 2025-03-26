import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login as loginAction } from '../Redux/AuthSlice.js';
import './Register.css';

export const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    try {
      setIsLoggingIn(true);
      e.preventDefault();
      if (!validateEmail(email)) {
        alert("Please enter a valid email.");
        return;
      } else if (phone.length !== 10) {
        alert("Please enter a valid phone number.");
        return;
      } else if (password.length < 6) {
        alert("Password should be atleast 6 characters.");
        return;
      } else if (name.length < 3) {
        alert("Name should be atleast 3 characters.");
        return;
      }
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        phone
      });
      console.log(res);
      dispatch(loginAction({
        token: res.data.token,
        user: res.data.user
      }));

      navigate('/');
    } catch (error) {
      alert("Invalid credentials");
      console.log(error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  return (
    <div className="login-page">
      <div className="form-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor="phone">Phone:</label>
            <input
              type="number"
              id='phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor="Name">Name:</label>
            <input
              type="text"
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? "Register..." : "Register"}
          </button>
          <button onClick={() => { window.location.href = '/login' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
