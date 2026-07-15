/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { IUser } from '@/models/user.model'
import mongoose from 'mongoose'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { ArrowLeft, MapPin, Package, Truck } from 'lucide-react'
import LiveMap from '@/components/LiveMap'
import { getSocket } from '@/lib/socket'
import { motion, type Variants } from 'motion/react'
import DeliveryChat from '@/components/DeliveryChat'

interface IOrder {
    _id?: mongoose.Types.ObjectId,
    user: mongoose.Types.ObjectId,
    items: [
        {
            grocery: mongoose.Types.ObjectId,
            name: string,
            price: string,
            unit: string,
            image: string,
            quantity: number
        }
    ],
    isPaid: boolean,
    totalAmount: number,
    paymentMethod: "cod" | "online",
    address: {
        fullName: string,
        city: string,
        state: string,
        pincode: string,
        fullAddress: string,
        mobile: string,
        latitude: number,
        longitude: number
    },
    assignment?: mongoose.Types.ObjectId,
    assignedDeliveryMan?: IUser, 
    status: "pending" | "out for delivery" | "delivered",
    createdAt?: Date,
    updatedAt?: Date
}
interface ILocation {
  latitude: number, 
  longitude: number
}

const TrackOrder = ({params}:{params:{orderId:string}}) => {
  const {userData} = useSelector((state:RootState) => state.user)
  const {orderId} = useParams()
  const [order, setOrder] = useState<IOrder>()
  const [userLocation, setUserLocation] = useState<ILocation>({latitude:0, longitude: 0})
  const [deliveryLocation, setDeliveryLocation] = useState<ILocation>({latitude:0, longitude: 0})
  const router = useRouter()

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.08 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  useEffect(()=>{
    const getOrder = async () => {
      try {
        const result = await axios.get(`/api/user/get-active-order/${orderId}`)
        setOrder(result.data)
        setUserLocation({
          latitude: result.data.address.latitude,
          longitude: result.data.address.longitude
        })
        setDeliveryLocation({
          latitude: result.data.assignedDeliveryMan.location.coordinates[1],
          longitude: result.data.assignedDeliveryMan.location.coordinates[0],
        })
      } catch (error) {
        console.log(error);
      }
    }
    getOrder()
  }, [userData?._id, orderId])

  useEffect(():any=>{
    const socket = getSocket()
    socket.on("update-deliveryMan-locaton", ((userId, location) => {
      if(userId.toString() === order?.assignedDeliveryMan?._id?.toString()){
        setDeliveryLocation({
          latitude: location.coordinates[1],
          longitude: location.coordinates[0]
        })
      }
    }))
    return ()=>socket.off("update-deliveryMan-location")
  }, [order])

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-blue-50/70 to-white px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-6xl"
      >
        <motion.div
          variants={itemVariants}
          className="mb-6 flex items-center justify-between gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            onClick={()=> router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 font-medium text-blue-700 shadow-sm shadow-blue-100/70 transition-colors hover:bg-blue-50 hover:text-blue-800"
          >
            <ArrowLeft size={18}/>
            <span className="hidden sm:inline">Back</span>
          </motion.button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-xl shadow-blue-100/60"
        >
          <div className="border-b border-blue-100/80 bg-linear-to-r from-blue-50/70 via-white to-blue-50/40 px-5 py-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Track order</p>
                <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-900 sm:text-4xl">Order Tracking</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Follow the live delivery route and check the latest order status.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <Package size={16} />
                Order #{order?._id!.toString().slice(-6)}
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:p-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                  {order?.status}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                  Live map
                </span>
              </div>

              <div className="overflow-hidden rounded-3xl border border-blue-100 bg-blue-50/30 p-3 shadow-sm shadow-blue-100/50 sm:p-4">
                <LiveMap userLocation={userLocation} deliveryLocation={deliveryLocation}/>
              </div>
              {order?._id && (
                <DeliveryChat orderId={order._id} senderId={userData?._id}/>
              )}
            </div>

            <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-lg shadow-blue-100/60 sm:p-6">
              <div className="flex items-center gap-3 rounded-2xl bg-blue-50/70 p-4">
                <Truck className="h-10 w-10 shrink-0 rounded-2xl bg-white p-2 text-blue-700 shadow-sm shadow-blue-100/60" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Delivery status</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {order?.status === "delivered" ? "Delivered" : "On the way"}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-blue-50/60 px-4 py-3 text-sm leading-6 text-slate-600">
                  <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
                    <MapPin size={16} className="text-blue-700" />
                    Delivery address
                  </span>
                  <p className="mt-2 wrap-break-word">{order?.address.fullAddress}</p>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                  Keep this page open for live delivery updates.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default TrackOrder
