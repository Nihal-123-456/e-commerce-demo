import React from 'react'
import DeliveryManDashboard from './DeliveryManDashboard'
import { auth } from '@/auth'
import connectDb from '@/lib/db'
import Order from '@/models/order.model'

const DeliveryMan = async () => {
  await connectDb()
  const session = await auth()
  const deliveryManId = session?.user?.id
  const orders = await Order.find({
    assignedDeliveryMan: deliveryManId,
    deliveryOtpVerification: true
  })

  const today = new Date().toDateString()
  const todayOrders = orders.filter((o)=>new Date(o.deliveredAt).toDateString() === today).length
  const todayEarning = todayOrders * 50

  return (
    <DeliveryManDashboard earning={todayEarning}/>
  )
}

export default DeliveryMan