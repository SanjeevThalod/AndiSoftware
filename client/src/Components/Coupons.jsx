import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Coupons.css';
import { FaPlusCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Coupons = () => {
  const {isAuthenticated, user, token} = useSelector((state) => state.auth);
  const [coupons, setCoupons] = useState([]);
  const [couponData, setCouponData] = useState({
    name: '',
    quantity: '',
    expiry: ''
  });

  // Fetch existing coupons
  const fetchCoupons = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/coupon', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoupons(res.data);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [token]);

  // Random 10-character coupon code generator
  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
    let code = '';
    for (let i = 0; i < 10; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Create new coupon
  const handleCreateCoupon = async () => {
    console.log(couponData)
    if (!couponData.name || !couponData.quantity || !couponData.expiry) {
      alert('Please fill all fields');
      return;
    }
    const newCoupon = {
      name: couponData.name,
      Quantity: couponData.quantity,
      endDate: couponData.expiry,
      code: generateCode()
    };
    try {
      const res = await axios.post('http://localhost:5000/api/coupon', newCoupon, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCoupons();
      setCouponData({ name: '', quantity: '', expiry: '' });
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="coupon-container">
      <h2 className="heading">Coupons List</h2>

      {/* Coupon Creation */}
      <div className="create-coupon">
        <input
          type="text"
          placeholder="Coupon Name"
          value={couponData.name}
          onChange={(e) => setCouponData({ ...couponData, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={couponData.quantity}
          onChange={(e) => setCouponData({ ...couponData, quantity: e.target.value })}
        />
        <input
          type="number"
          placeholder="Expiry"
          value={couponData.expiry}
          onChange={(e) => setCouponData({ ...couponData, expiry: e.target.value })}
        />
        <button className="create-btn" onClick={handleCreateCoupon}>
          <FaPlusCircle /> Create
        </button>
      </div>

      {/* Coupons List */}
      <div className="coupon-list">
        {coupons.length === 0 ? (
          <p>No coupons created yet</p>
        ) : (
          coupons.map(coupon => (
            <div className="coupon-card" key={coupon._id}>
              <p><strong>Name:</strong> {coupon.name}</p>
              <p><strong>Code:</strong> {coupon.code}</p>
              <p><strong>Quantity:</strong> {coupon.Quantity}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Coupons;
