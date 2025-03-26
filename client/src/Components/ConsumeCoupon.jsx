import React, { useState } from 'react';
import './ConsumeCoupon.css';
import { FaTicketAlt } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ConsumeCoupon = () => {
  const {isAuthenticated, user, token} = useSelector((state) => state.auth);
  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState('');

  const handleConsume = async () => {
    if (!couponCode) {
      setMessage('Please enter a coupon code');
      return;
    }

    try {
      // Example API call (replace with your real API)
      const res = await axios.post('http://localhost:5000/api/coupon/redeem', { code: couponCode },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      if (res.data.success) {
        setMessage(`✅ Coupon applied! Offer: ${res.data.coupon.name}`);
      }else if(res.data.exhausted){
        setMessage('❌ Coupon has already been redeemed by you');
      }
       else {
        setMessage('❌ Invalid or expired coupon');
      }
    } catch (error) {
      setMessage('❌ Invalid or expired coupon');
    }
  };

  return (
    <div className="consume-container">
      <h2><FaTicketAlt /> Use Your Coupon</h2>
      <input 
        type="text" 
        placeholder="Enter Coupon Code" 
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
      />
      <button onClick={handleConsume}>Apply Coupon</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ConsumeCoupon;
