'use client'

import { ArrowLeft, Minus, Plus, ShoppingBasket, Trash } from "lucide-react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import Image from "next/image"
import { decreaseQuantity, increaseQuantity, removeFromCart } from "@/redux/cartSlice"
import { useRouter } from "next/navigation"

const Cart = () => {
  const { cartData, subTotal, deliveryFee, finalTotal } = useSelector((state: RootState) => state.cart)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.09, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, x: -20, scale: 0.96 },
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-blue-50/60 to-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-7xl pb-16">
        <Link
          href="/"
          className="absolute left-0 top-0 flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 font-medium text-blue-700 shadow-sm shadow-blue-100/70 transition-colors hover:bg-blue-50 hover:text-blue-800"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back to home</span>
        </Link>

        <motion.h2
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="pt-14 text-3xl font-extrabold tracking-normal text-slate-900 sm:text-4xl"
        >
          Your Shopping Cart
        </motion.h2>

        {cartData.length == 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mt-10 flex min-h-[55vh] flex-col items-center justify-center rounded-3xl border border-blue-100 bg-white px-6 py-14 text-center shadow-lg shadow-blue-100/60"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <ShoppingBasket className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">Your cart is empty</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              Add some groceries to continue shopping and build your order.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-md shadow-blue-300/60 transition-colors hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)] lg:items-start">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {cartData.map((item) => (
                  <motion.div
                    key={item._id.toString()}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg shadow-blue-100/60"
                  >
                    <div className="grid gap-4 p-4 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center sm:p-5">
                      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-blue-50">
                        <Image className="object-cover" src={item.image} alt={item.name} fill />
                      </div>
                      <div className="min-w-0">
                        <p className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                          {item.category}
                        </p>
                        <h3 className="mt-3 text-lg font-extrabold leading-6 text-slate-900 sm:text-xl">
                          {item.name}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          {item.quantity} x {item.unit}
                        </p>
                        <p className="mt-3 text-2xl font-black text-blue-700">
                          Tk {Number(item.price) * item.quantity}
                        </p>
                      </div>
                      <div className="flex flex-row-reverse items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                        <motion.button
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.92 }}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100"
                          onClick={() => dispatch(removeFromCart(item._id))}
                        >
                          <Trash size={18} />
                        </motion.button>
                        <div className="flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50 px-3 py-2">
                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm transition-colors hover:bg-blue-100"
                            onClick={() => dispatch(decreaseQuantity(item._id))}
                          >
                            <Minus size={14} />
                          </motion.button>
                          <span className="min-w-6 text-center text-sm font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm transition-colors hover:bg-blue-100"
                            onClick={() => dispatch(increaseQuantity(item._id))}
                          >
                            <Plus size={14} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
              className="rounded-3xl border border-blue-100 bg-white p-6 shadow-xl shadow-blue-100/60 lg:sticky lg:top-8"
            >
              <h2 className="text-2xl font-extrabold text-slate-900">Order Summary</h2>
              <div className="mt-6 space-y-4 rounded-2xl bg-blue-50/60 p-5">
                <div className="flex items-center justify-between gap-4 text-sm font-medium text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">Tk {subTotal}</span>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm font-medium text-slate-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-slate-900">Tk {deliveryFee}</span>
                </div>
                <div className="border-t border-blue-100 pt-4">
                  <div className="flex items-center justify-between gap-4 text-base font-semibold text-slate-700">
                    <span>Final Total</span>
                    <span className="text-2xl font-black text-blue-700">Tk {finalTotal}</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-300/60 transition-colors hover:bg-blue-700" onClick={()=>router.push("/user/checkout")}
              >
                Proceed to checkout
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
