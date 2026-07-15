import React from 'react'
import DeliveryManDashboard from './DeliveryManDashboard'
import { auth } from '@/auth'
import connectDb from '@/lib/db'
import Order from '@/models/order.model'
import { redirect } from 'next/navigation'

const DeliveryMan = async () => {
  const session = await auth()

  if (!session?.user) {
    redirect('/landing')
  }

  if (session.user.role !== 'deliveryMan') {
    redirect('/unauthorized')
  }

  await connectDb()
  const deliveryManId = session.user.id
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