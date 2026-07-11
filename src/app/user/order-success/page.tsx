'use client'

import React from 'react'
import { motion } from 'motion/react'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const OrderSuccess = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.12, delayChildren: 0.08 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-blue-50/70 to-white px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto flex min-h-[80vh] w-full max-w-3xl flex-col items-center justify-center"
      >
        <motion.div
          variants={itemVariants}
          className="relative mb-8 flex items-center justify-center"
        >
          <div className="absolute h-32 w-32 rounded-full bg-blue-100/70 blur-2xl" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-blue-100 bg-white shadow-xl shadow-blue-200/60 sm:h-28 sm:w-28">
            <CheckCircle className="h-14 w-14 text-blue-600 sm:h-16 sm:w-16" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-28 w-28 rounded-full border-2 border-blue-200/80 sm:h-32 sm:w-32"
          />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-center text-3xl font-black tracking-normal text-slate-900 sm:text-4xl lg:text-5xl"
        >
          Order placed successfully
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-4 max-w-2xl text-center text-sm leading-7 text-slate-600 sm:text-base"
        >
          Thank you for shopping with us. Your order has been placed and is being processed. You can track its progress in your{" "}
          <span className="font-semibold text-blue-700">My Orders</span> section.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-8 flex items-center justify-center gap-3 rounded-full border border-blue-100 bg-white px-5 py-3 text-blue-700 shadow-md shadow-blue-100/60"
        >
          <Package className="h-5 w-5" />
          <span className="text-sm font-semibold sm:text-base">Packed with care and ready for delivery</span>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-10">
          <Link
            href="/user/my-order"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-300/60 transition-colors hover:bg-blue-700"
          >
            Go to My Orders page
            <motion.span
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 500, damping: 24 }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.span>
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-10 grid w-full max-w-sm grid-cols-4 gap-3"
        >
          <div className="h-2 rounded-full bg-blue-600" />
          <div className="h-2 rounded-full bg-blue-300" />
          <div className="h-2 rounded-full bg-blue-200" />
          <div className="h-2 rounded-full bg-blue-100" />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default OrderSuccess
