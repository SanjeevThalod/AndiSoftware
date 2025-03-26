import React from 'react'
import Navbar from '../Components/Navbar'
import ConsumeCoupon from '../Components/ConsumeCoupon'
import RedeemedCoupons from '../Components/RedeemedCoupons'

export default function Home() {
  return (
    <div>
      <Navbar/>
      <ConsumeCoupon/>
      <RedeemedCoupons/>
    </div>
  )
}
