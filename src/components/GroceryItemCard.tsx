'use client'

import React from 'react'
import { motion, type Variants } from 'motion/react'
import Image from 'next/image'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { addToCart, decreaseQuantity, increaseQuantity } from '@/redux/cartSlice'
import { IGrocery } from '@/models/grocery.model'

const GroceryItemCard = ({item}:{item: IGrocery}) => {
  const dispatch = useDispatch<AppDispatch>()
  const {cartData} = useSelector((state:RootState) => state.cart)
  const itemId = item._id?.toString() ?? ""
  const cartItem = cartData.find(i=>i._id?.toString() === itemId)
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  return (
    <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className='group overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg shadow-blue-100/70 transition-shadow duration-200 hover:shadow-2xl hover:shadow-blue-200/60'
    >
        <div className='relative aspect-4/3 overflow-hidden bg-blue-50'>
            <Image className='object-cover transition-transform duration-500 group-hover:scale-105' src={item.image} fill alt={item.name}/>
            <div className='absolute inset-0 bg-linear-to-t from-blue-950/25 via-transparent to-transparent' />
        </div>
        <div className='flex min-h-55 flex-col gap-4 p-5'>
            <p className='w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700'>
                {item.category}
            </p>
            <h3 className='text-xl font-extrabold leading-7 text-slate-900'>{item.name}</h3>
            <div className='flex items-center justify-between gap-3 text-sm font-semibold text-slate-600'>
                <span className='rounded-full bg-slate-100 px-3 py-1 text-slate-700'>{item.unit}</span>
                <span className='text-2xl font-black text-blue-700'>Tk {item.price}</span>
            </div>
            {cartItem ? <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}} className='mt-4 flex items-center justify-center bg-blue-50 border border-blue-200 rounded-full py-2 px-4 gap-4'>
                <button className='w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-all' onClick={()=>dispatch(decreaseQuantity(itemId))}><Minus size={16} className='text-blue-700'/></button>
                <span className='text-sm font-semibold text-gray-800'>{cartItem.quantity}</span>
                <button className='w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-all' onClick={()=>dispatch(increaseQuantity(itemId))}><Plus size={16} className='text-blue-700'/></button>
            </motion.div> : <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 20 }}
                className='mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-3 font-semibold text-white shadow-md shadow-blue-300/60 transition-colors duration-200 hover:bg-blue-700'
                onClick={() => dispatch(addToCart({
                  _id: itemId,
                  name: item.name,
                  category: item.category,
                  price: item.price,
                  unit: item.unit,
                  image: item.image,
                  quantity: 1,
                }))}
            >
                <ShoppingCart className='h-5 w-5'/> Add to cart
            </motion.button>}
            
        </div>
    </motion.div>
  )
}

export default GroceryItemCard
