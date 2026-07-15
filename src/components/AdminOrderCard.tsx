/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import axios from 'axios'
import { CreditCard, MapPin, Package, Phone, User, ChevronUp, ChevronDown, Clock3, UserCheck } from 'lucide-react'
import { motion, AnimatePresence, type Variants } from 'motion/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import mongoose from 'mongoose'
import { IUser } from '@/models/user.model'
import { getSocket } from '@/lib/socket'

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

const AdminOrderCard = ({order}:{order:IOrder}) => {
  const statusOptions = ["pending", "out for delivery", "delivered"]
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState<string>("pending")

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  const contentVariants: Variants = {
    hidden: { opacity: 0, height: 0, y: -6 },
    visible: { opacity: 1, height: "auto", y: 0 },
  }

  const statusBadge = () => {
    if (status === "pending") return "bg-amber-50 text-amber-700 border-amber-200"
    if (status === "delivered") return "bg-emerald-50 text-emerald-700 border-emerald-200"
    return "bg-blue-50 text-blue-700 border-blue-200"
  }

  const updateStatus = async (orderId:string, status:string) => {
    try {
      const result = await axios.post(`/api/admin/update-order-status/${orderId}`, { status })
      console.log(result);
      setStatus(status)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=>{
    const setUiStatus = () => {
      setStatus(order.status)
    }
    setUiStatus()
  }, [order])

  useEffect(():any=>{
      const socket = getSocket()
      socket.on("order-status-update", (data) => {
        if(data.orderId.toString() === order._id?.toString()){
          setStatus(data.status)
        }
      })
      return () => socket.off("order-status-update")
    }, [])

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg shadow-blue-100/60"
    >
      <div className="border-b border-blue-100/80 bg-linear-to-r from-blue-50/70 via-white to-blue-50/50 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm shadow-blue-300/60">
                <Package size={14}/>
                Order #{order._id!.toString().slice(-6)}
              </span>
              {status !== "delivered" && <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${order.isPaid ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
                {order.isPaid ? "Paid" : "Unpaid"}
              </span>}
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock3 size={16} className="shrink-0 text-blue-600" />
              <span>{new Date(order.createdAt!).toLocaleString()}</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="flex items-start gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm shadow-blue-100/40">
                <User size={16} className="mt-0.5 shrink-0 text-blue-700" />
                <span className="min-w-0 wrap-break-word text-sm font-medium text-slate-700">{order.address.fullName}</span>
              </div>
              <div className="flex items-start gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm shadow-blue-100/40">
                <Phone size={16} className="mt-0.5 shrink-0 text-blue-700" />
                <span className="min-w-0 wrap-break-word text-sm font-medium text-slate-700">{order.address.mobile}</span>
              </div>
              <div className="flex items-start gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm shadow-blue-100/40 sm:col-span-2 xl:col-span-1">
                <MapPin size={16} className="mt-0.5 shrink-0 text-blue-700" />
                <span className="min-w-0 wrap-break-word text-sm font-medium leading-6 text-slate-700">{order.address.fullAddress}</span>
              </div>
              <div className="flex items-start gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm shadow-blue-100/40">
                <CreditCard size={16} className="mt-0.5 shrink-0 text-blue-700" />
                <span className="min-w-0 wrap-break-word text-sm font-medium text-slate-700">
                  {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                </span>
              </div>
            </div>
            {order.assignedDeliveryMan && 
              <div
                id='deliveryManDetails'
                className='mt-4 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 shadow-sm shadow-blue-100/50 sm:flex-row sm:items-center sm:justify-between'
              >
                <div className='flex min-w-0 items-start gap-3'>
                  <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm shadow-blue-100/60'>
                    <UserCheck size={18}/>
                  </div>
                  <div className='min-w-0'>
                    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>Delivery man</p>
                    <p className='mt-1 wrap-break-word text-sm font-semibold text-slate-900'>
                      Assigned to: <span className='text-blue-700'>{order.assignedDeliveryMan.name}</span>
                    </p>
                    <p className='mt-1 text-sm font-medium text-slate-600'>📞 {order.assignedDeliveryMan.mobile}</p>
                  </div>
                </div>
                <a
                  href={`tel:${order.assignedDeliveryMan.mobile}`}
                  className='inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-300/60 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-400/60'
                >
                  Call
                </a>
              </div>
            }
          </div>

          <div className="flex flex-col gap-3 lg:min-w-65 lg:items-end">
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${statusBadge()}`}>
                {status}
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                {order.items.length} items
              </span>
            </div>

            {status !== "delivered" && 
            <div className="w-full rounded-2xl border border-blue-100 bg-white p-3 shadow-sm shadow-blue-100/50">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Update Status
              </label>
              <select
                name=""
                id=""
                className="w-full rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm font-semibold text-blue-800 outline-none transition-all duration-200 hover:bg-blue-50 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100" onChange={(e) => updateStatus(order._id!.toString(), e.target.value)} value={status}
              >
                {statusOptions.map((st, index) => (
                  <option value={st} key={index}>
                    {st.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            }

            <div className="w-full rounded-2xl bg-blue-50/70 px-4 py-3 text-left lg:min-w-40 lg:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total</p>
              <p className="mt-1 text-2xl font-black text-blue-700">Tk {order.totalAmount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            onClick={()=>setExpanded(prev => !prev)}
            className="inline-flex w-full items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-white px-4 py-3 font-semibold text-blue-700 shadow-sm shadow-blue-100/60 transition-colors hover:bg-blue-50 sm:w-auto"
          >
            <span className="inline-flex items-center gap-2">
              <Package size={16}/>
              {expanded ? "Hide Order Items" : `View ${order.items.length} Items`}
            </span>
            {expanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </motion.button>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="mt-4 border-t border-blue-100 bg-blue-50/40 pt-4"
            >
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm shadow-blue-100/40 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-blue-50">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="wrap-break-word font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">
                          {item.quantity} x {item.unit}
                        </p>
                      </div>
                    </div>
                    <p className="shrink-0 text-left text-sm font-bold text-blue-700 sm:text-right">
                      Tk {Number(item.price) * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default AdminOrderCard
