'use client'

import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, type Variants } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import GroceryItemCard from './GroceryItemCard'
import { IGrocery } from '@/models/grocery.model'

const PREVIEW_LIMIT = 10

type LandingProductsProps = {
  groceryList: IGrocery[]
  role?: 'user' | 'admin' | 'deliveryMan'
}

const LandingProducts = ({ groceryList, role }: LandingProductsProps) => {
  const [showLeft, setShowLeft] = useState<boolean>()
  const [showRight, setShowRight] = useState<boolean>()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = direction == "left" ? -400 : 400
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeft(scrollLeft > 0)
    setShowRight((scrollLeft + clientWidth) <= scrollWidth - 5)
  }

  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (!scrollRef.current) return
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      if ((scrollLeft + clientWidth) >= scrollWidth - 5) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        scrollRef.current.scrollBy({ left: 400, behavior: "smooth" })
      }
    }, 3000)
    return () => clearInterval(autoScroll)
  }, [])

  useEffect(() => {
    scrollRef.current?.addEventListener("scroll", checkScroll)
    checkScroll()
    return () => removeEventListener("scroll", checkScroll)
  }, [])

  if (groceryList.length === 0) {
    return null
  }
  const previewItems = groceryList.slice(0, PREVIEW_LIMIT)

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='rounded-4xl border border-blue-100 bg-white/80 py-8 shadow-[0_20px_60px_-20px_rgba(37,99,235,0.15)] backdrop-blur'
    >

      <div className='mb-6 flex flex-wrap items-end justify-between gap-4 px-4 sm:px-6 lg:px-8'>
        <div>
          <p className='text-sm font-semibold uppercase tracking-[0.18em] text-blue-600'>Browse</p>
          <h2 className='mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl'>Popular Groceries</h2>
        </div>
        <Link
          href='/products'
          className='inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50'
        >
          Show all products
          <ArrowRight className='h-4 w-4' />
        </Link>
      </div>

      <div className='relative'>
        {showLeft && (
          <button
            type='button'
            onClick={() => scroll("left")}
            className='absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700 shadow-lg shadow-blue-200/60 transition-all duration-200 hover:-translate-x-0.5 hover:bg-blue-600 hover:text-white hover:shadow-blue-300 sm:left-4'
          >
            <ChevronLeft className='h-5 w-5' />
          </button>
        )}

        <motion.div
          ref={scrollRef}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.06 }}
          className='flex gap-5 overflow-x-auto scroll-smooth px-4 pb-4 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden sm:px-6 lg:px-8'
        >
          {previewItems.map((item, index) => (
            <motion.div
              variants={itemVariants}
              key={item._id?.toString() || `${item.name}-${index}`}
              className='w-64 shrink-0 sm:w-72'
            >
              <GroceryItemCard item={item} role={role} />
            </motion.div>
          ))}
        </motion.div>

        {showRight && (
          <button
            type='button'
            onClick={() => scroll("right")}
            className='absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700 shadow-lg shadow-blue-200/60 transition-all duration-200 hover:translate-x-0.5 hover:bg-blue-600 hover:text-white hover:shadow-blue-300 sm:right-4'
          >
            <ChevronRight className='h-5 w-5' />
          </button>
        )}
      </div>
    </motion.section>
  )
}

export default LandingProducts
