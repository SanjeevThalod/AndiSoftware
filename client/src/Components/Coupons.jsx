import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Coupons.css';
import { FaPlusCircle } from 'react-icons/fa';

const Coupons = () => {
  const [coupons, setCoupons] = useState([
    { name: "Summer Sale", code: "A1b@C3d#E4", quantity: 100 },
    { name: "Winter Blast", code: "Xy9%Qw8@Zp", quantity: 50 },
    { name: "Festive50", code: "Fg4$Kl7^Mn", quantity: 200 },
    { name: "MonsoonMagic", code: "J8k&Op1@Zx", quantity: 80 },
    { name: "SuperSaver", code: "Rt5@Vb7#Lm", quantity: 150 },
    { name: "NewYear2025", code: "Yh3^Bn6$Tf", quantity: 70 },
    { name: "DiwaliDhamaka", code: "Ui8%Gh2@Kr", quantity: 120 },
    { name: "MegaDeal", code: "Qw5@Er7#Ty", quantity: 90 },
    { name: "FlashSale", code: "Lo6&Pk4@Mb", quantity: 60 },
    { name: "HolidayBonanza", code: "Zp9^Xc3$Lv", quantity: 110 }
  ]);
  const [couponData, setCouponData] = useState({
    name: '',
    quantity: '',
  });

  // Fetch existing coupons
  const fetchCoupons = () => {
    axios.get('http://localhost:5000/admin/coupons')
      .then(res => setCoupons(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

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
  const handleCreateCoupon = () => {
    if (!couponData.name || !couponData.quantity) {
      alert('Please fill all fields');
      return;
    }
    const newCoupon = {
      name: couponData.name,
      quantity: couponData.quantity,
      code: generateCode()
    };
    axios.post('http://localhost:5000/admin/create-coupon', newCoupon)
      .then(() => {
        fetchCoupons();
        setCouponData({ name: '', quantity: '' });
      })
      .catch(err => console.error(err));
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
              <p><strong>Quantity:</strong> {coupon.quantity}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Coupons;
