'use client'

import { IOrder } from '@/models/order.model'
import axios from 'axios'
import { ArrowLeft, Loader2, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import UserOrderCard from '@/components/UserOrderCard'

const MyOrder = () => {
  const router = useRouter()
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.08 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  useEffect(() => {
    const getMyOrders = async () => {
      try {
        const result = await axios.get("/api/user/my-orders")
        setOrders(result.data)
      } catch(error) {
        console.log(error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    getMyOrders()
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-blue-50/70 to-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 font-medium text-blue-700 shadow-sm shadow-blue-100/70 transition-colors hover:bg-blue-50 hover:text-blue-800"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to home</span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-8 rounded-3xl border border-blue-100 bg-white px-6 py-6 shadow-lg shadow-blue-100/60 sm:px-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Order history</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-900 sm:text-4xl">My Orders</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Review your placed orders, check status updates, and expand each order to see the items inside.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex min-h-[45vh] flex-col items-center justify-center rounded-3xl border border-blue-100 bg-white px-6 py-14 text-center shadow-lg shadow-blue-100/60"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600"
              >
                <Loader2 className="h-8 w-8" />
              </motion.div>
              <p className="text-base font-semibold text-slate-700">Loading your orders...</p>
            </motion.div>
          ) : orders.length === 0 ? (
            <motion.div
              key="empty"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -12 }}
              className="flex min-h-[55vh] flex-col items-center justify-center rounded-3xl border border-blue-100 bg-white px-6 py-14 text-center shadow-lg shadow-blue-100/60"
            >
              <motion.div
                variants={itemVariants}
                className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600"
              >
                <Package className="h-10 w-10" />
              </motion.div>
              <motion.h2 variants={itemVariants} className="text-2xl font-extrabold text-slate-900">
                No Orders found
              </motion.h2>
              <motion.p variants={itemVariants} className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                Start shopping to view your orders here.
              </motion.p>
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                onClick={() => router.push("/")}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-md shadow-blue-300/60 transition-colors hover:bg-blue-700"
              >
                Continue Shopping
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="orders"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-5"
            >
              {orders.map((order, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <UserOrderCard order={order} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MyOrder
