import React, { useState } from 'react';
import './ConsumeCoupon.css';
import { FaTicketAlt } from 'react-icons/fa';
import axios from 'axios';

const ConsumeCoupon = () => {
  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState('');

  const handleConsume = async () => {
    if (!couponCode) {
      setMessage('Please enter a coupon code');
      return;
    }

    try {
      // Example API call (replace with your real API)
      const res = await axios.post('http://localhost:5000/user/consume-coupon', { code: couponCode });
      
      if (res.data.success) {
        setMessage(`✅ Coupon applied! Offer: ${res.data.offer}`);
      } else {
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
