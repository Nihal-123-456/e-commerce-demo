'use client'

import { IOrder } from '@/models/order.model'
import React, { useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, Truck } from 'lucide-react'
import Image from 'next/image'

const UserOrderCard = ({order}:{order:IOrder}) => {
  const [expanded, setExpanded] = useState(false)

  const getStatusColor = (status:string) => {
    switch(status) {
        case "pending":
            return "bg-amber-50 text-amber-700 border-amber-200"
        case "out for delivery":
            return "bg-blue-50 text-blue-700 border-blue-200"
        case "delivered":
            return "bg-emerald-50 text-emerald-700 border-emerald-200"
        default:
            return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  const contentVariants: Variants = {
    hidden: { opacity: 0, height: 0, y: -6 },
    visible: { opacity: 1, height: "auto", y: 0 },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg shadow-blue-100/60"
    >
      <div className="flex flex-col gap-4 border-b border-blue-100/80 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">
            Order <span className="text-blue-700">#{order?._id?.toString()?.slice(-6)}</span>
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {new Date(order.createdAt!).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>
          <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1.1fr)_auto] sm:items-start">
        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex items-start gap-2 rounded-2xl bg-blue-50/70 px-4 py-3">
            <CreditCard size={16} className="mt-0.5 shrink-0 text-blue-700" />
            <span className="min-w-0 font-medium">
              {order.paymentMethod == "cod" ? "Cash on Delivery" : "Online Payment"}
            </span>
          </div>
          <div className="flex items-start gap-2 rounded-2xl bg-blue-50/70 px-4 py-3">
            <MapPin size={16} className="shrink-0 text-blue-700" />
            <span className="min-w-0 break-words font-medium leading-6">{order.address.fullAddress}</span>
          </div>
          <div className="flex items-start gap-2 rounded-2xl bg-blue-50/70 px-4 py-3">
            <Truck size={16} className="mt-0.5 shrink-0 text-blue-700" />
            <span className="min-w-0 font-medium">
              Delivery: <span className="font-semibold text-blue-700">{order.status}</span>
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
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

          <div className="rounded-2xl bg-blue-50/70 px-4 py-3 text-left sm:min-w-40 sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total</p>
            <p className="mt-1 text-2xl font-black text-blue-700 sm:text-2xl">Tk {order.totalAmount}</p>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="border-t border-blue-100 bg-blue-50/40 px-5 py-4"
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
                      <p className="break-words font-semibold text-slate-900">{item.name}</p>
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
    </motion.div>
  )
}

export default UserOrderCard
