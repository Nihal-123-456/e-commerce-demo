'use client'

import { Apple, Baby, Box, ChevronLeft, ChevronRight, Coffee, Cookie, Flame, Heart, HomeIcon, Milk, Wheat } from 'lucide-react'
import { motion, type Variants } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const CategorySlider = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: "easeOut",
        staggerChildren: 0.08,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 18, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  const categories = [
    {id:1, name:"Fruits & Vegetables", icon: Apple, color: "bg-green-100"}, 
    {id:2, name:"Dairy & Eggs", icon: Milk, color: "bg-green-100"}, 
    {id:3, name:"Rice & Grains", icon: Wheat, color: "bg-yellow-100"}, 
    {id:4, name:"Snacks & Biscuits", icon: Cookie, color: "bg-orange-100"}, 
    {id:5, name: "Spices & Masalas", icon: Flame, color: "bg-pink-100"}, 
    {id:6, name:"Beverages & Drinks", icon: Coffee, color: "bg-red-100"}, 
    {id:7, name:"Personal Care", icon: Heart, color: "bg-blue-100"}, 
    {id:8, name:"Household Essentials", icon: HomeIcon, color: "bg-purple-100"}, 
    {id:9, name: "Package Food", icon: Box, color: "bg-teal-100"}, 
    {id:10, name: "Baby & Pet Care", icon: Baby, color: "bg-rose-100"}
  ]

  const [showLeft, setShowLeft] = useState<boolean>()
  const [showRight, setShowRight] = useState<boolean>()
  const scrollRef = useRef<HTMLDivElement>(null)
  const scroll = (direction:"left" | "right") => {
    if(!scrollRef.current) return
    const scrollAmount = direction == "left" ? -300 : 300
    scrollRef.current.scrollBy({left: scrollAmount, behavior: "smooth"})
  }

  const checkScroll = () => {
    if(!scrollRef.current) return
    const {scrollLeft, scrollWidth, clientWidth} = scrollRef.current
    setShowLeft(scrollLeft > 0)
    setShowRight((scrollLeft + clientWidth) <= scrollWidth-5)
  } 
  useEffect(() => {
    const autoScroll = setInterval(()=>{
        if(!scrollRef.current) return
        const {scrollLeft, scrollWidth, clientWidth} = scrollRef.current
        if((scrollLeft + clientWidth) >= scrollWidth-5){
            scrollRef.current.scrollTo({left: 0, behavior: "smooth"})
        } else {
            scrollRef.current.scrollBy({left: 300, behavior: "smooth"})
        }
    }, 3000)
    return ()=>clearInterval(autoScroll)
  }, [])

  useEffect(()=>{
    scrollRef.current?.addEventListener("scroll", checkScroll)
    checkScroll()
    return ()=>removeEventListener("scroll", checkScroll)
  }, [])

  return (
    <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='relative mx-auto w-full max-w-7xl px-4 py-8 [&_h2]:mb-6 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-normal [&_h2]:text-blue-800 sm:px-6 sm:[&_h2]:text-3xl lg:px-8'
    >
        <h2>🛒 Shop by Category</h2>

        {showLeft && <button className='absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700 shadow-lg shadow-blue-200/60 transition-all duration-200 hover:-translate-x-0.5 hover:bg-blue-600 hover:text-white hover:shadow-blue-300 sm:left-4' onClick={()=> scroll("left")}><ChevronLeft className='h-5 w-5'/></button>}
        
        <div ref={scrollRef} className='flex gap-4 overflow-x-auto scroll-smooth px-1 pb-3 pt-1 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden sm:gap-5'>
            {categories.map((cat) => {
                const Icon = cat.icon
                return <motion.div
                    key={cat.id}
                    variants={cardVariants}
                    whileHover={{ y: -6, scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 360, damping: 24 }}
                    className='group min-w-36 shrink-0 cursor-pointer rounded-3xl border border-blue-100 bg-white p-4 text-center shadow-md shadow-blue-100/80 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50 sm:min-w-40 sm:p-5'
                >
                    <div className='flex h-full flex-col items-center justify-center gap-3'>
                        <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${cat.color} text-blue-700 shadow-inner shadow-white/70 transition-transform duration-200 group-hover:scale-110 sm:h-16 sm:w-16`}>
                            <Icon className='h-7 w-7 sm:h-8 sm:w-8' />
                        </span>
                        <p className='min-h-10 text-sm font-bold leading-5 text-slate-700 transition-colors duration-200 group-hover:text-blue-800 sm:text-base'>{cat.name}</p>
                    </div>
                </motion.div>
            })}
        </div>

        {showRight && <button className='absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700 shadow-lg shadow-blue-200/60 transition-all duration-200 hover:translate-x-0.5 hover:bg-blue-600 hover:text-white hover:shadow-blue-300 sm:right-4' onClick={()=> scroll("right")}><ChevronRight className='h-5 w-5'/></button>}
    </motion.div>
  )
}

export default CategorySlider
