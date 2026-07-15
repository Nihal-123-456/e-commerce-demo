"use client"

import React, { useEffect, useState } from 'react'
import { BadgePercent, ShoppingBasket, Truck } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

const HeroSection = () => {
  const slides = [
    {
      id: 1,
      icon: <ShoppingBasket className="h-28 w-28 text-blue-500 sm:h-28 sm:w-28 drop-shadow-lg" />,
      title: 'Fresh Groceries Delivered',
      subtitle: "Shop daily essentials, produce, and pantry favorites from home.",
      btnText: 'Start Shopping',
      bg: "https://plus.unsplash.com/premium_photo-1663039978847-63f7484bf701?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJlc2glMjBvcmdhbmljJTIwZ3JvY2VyeXxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      id: 2,
      icon: <BadgePercent className="h-28 w-28 text-yellow-500 sm:h-28 sm:w-28 drop-shadow-lg" />,
      title: 'Deals You Will Love',
      subtitle: 'Find weekly savings on the products your family uses most.',
      btnText: 'View Deals',
      bg: "https://plus.unsplash.com/premium_photo-1661547843345-e1ca800df0e0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFzdCUyMGdyb2NlcnklMjBkZWxpdmVyeXxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      id: 3,
      icon: <Truck className="h-28 w-28 text-green-500 sm:h-28 sm:w-28 drop-shadow-lg" />,
      title: 'Fast Doorstep Delivery',
      subtitle: 'Get your order packed with care and delivered right on time.',
      btnText: 'Order Now',
      bg: "https://plus.unsplash.com/premium_photo-1663012860167-220d9d9c8aca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
  ]

  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % slides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [slides.length])

  const currentSlide = slides[activeSlide]

  return (
    <section className="relative h-screen min-h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${currentSlide.bg})` }}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex h-full items-center justify-center px-5 text-center text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            className="flex max-w-3xl flex-col items-center"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.12, duration: 0.5, ease: "easeOut" }}
            >
              {currentSlide.icon}
            </motion.div>

            <motion.h1
              className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.45 }}
            >
              {currentSlide.title}
            </motion.h1>

            <motion.p
              className="mt-4 max-w-2xl text-base leading-7 text-white/90 sm:text-lg"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.45 }}
            >
              {currentSlide.subtitle}
            </motion.p>

            <motion.button
              type="button"
              className="mt-8 rounded-full bg-white px-8 py-3 text-sm font-semibold text-gray-950 shadow-xl shadow-black/25 transition-colors hover:bg-blue-500 hover:text-white"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
            >
              {currentSlide.btnText}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setActiveSlide(index)}
            className="group flex h-5 w-5 items-center justify-center"
          >
            <motion.span
              className={`block rounded-full ${
                activeSlide === index ? "bg-white" : "bg-white/45"
              }`}
              animate={{
                width: activeSlide === index ? 28 : 10,
                height: 10,
              }}
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.25 }}
            />
          </button>
        ))}
      </div>
    </section>
  )
}

export default HeroSection
