import { useEffect, useState } from 'react';
import axios from 'axios';
import './RedeemedCoupons.css';
import { useSelector } from 'react-redux';

const RedeemedCoupons = () => {
  const { user } = useSelector((state) => state.auth);
  const [redeemedCoupons, setRedeemedCoupons] = useState([]);

  const fetchRedeemedCoupons = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/coupons/redeemed', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setRedeemedCoupons(user.redeemedCoupons);
    } catch (error) {
      console.error("Failed to fetch redeemed coupons:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRedeemedCoupons();
    }
  }, [user]);

  return (
    <div className="redeemed-container">
      <h2>My Redeemed Coupons</h2>

      {redeemedCoupons.length === 0 ? (
        <p>No coupons redeemed yet.</p>
      ) : (
        <div className="coupon-list">
          {redeemedCoupons.map((coupon) => (
            <div key={coupon._id} className="coupon-card">
              <h3>{coupon.code}</h3>
              <p><strong>Discount:</strong> {coupon.coupon.name}%</p>
              <p><strong>Code:</strong> {coupon.coupon.code}</p>
              <p><strong>Expires on:</strong> {coupon.coupon.endDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RedeemedCoupons;
