import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { login as loginAction } from '../Redux/AuthSlice.js';
import './Register.css';
import { useNavigate } from 'react-router-dom';

export const Login = ()=> {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    try {
      setIsLoggingIn(true);
      e.preventDefault();
      if(!validateEmail(email)){
        alert("Please enter a valid email.");
        return;
      }else if(password.length < 6){
        alert("Password should be atleast 6 characters.");
        return;
      }
      const register = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
       });

       dispatch(loginAction({
        token: register.data.token,
        user: register.data.user
      }));
       console.log(register.data)
      navigate('/');
    } catch (error) {
      alert("Invalid credentials");
      console.log(error);
    }finally{
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
        <h2>Login</h2>
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
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
          <button onClick={()=>{window.location.href = '/register'}}>
            Register
          </button>
        </form>
      </div>
    </div>
  )
}
