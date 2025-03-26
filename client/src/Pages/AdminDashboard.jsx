import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PendingUsers from '../Components/PendingUsers'
import { IoArrowBackSharp } from "react-icons/io5";
import './AdminDashboard.css'
import Coupons from '../Components/Coupons';

export const AdminDashboard = () => {
  const [coupon, setCoupon] = useState(false);
  const navigate = useNavigate();

  const swith = () =>{
    setCoupon(!coupon);
  }
  return (
    <div>
      <div className='admin-nav'>
        <IoArrowBackSharp onClick={() => navigate('/')} />
        {coupon ? <p onClick={()=>swith()}>Users</p> : <p onClick={()=>swith()}>Coupons</p>}
      </div>
      <div>
        {coupon ? <Coupons /> : <PendingUsers />}

      </div>
    </div>
  )
}
