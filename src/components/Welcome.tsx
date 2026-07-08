'use client'

import React from 'react'
import { motion } from "motion/react"
import { ArrowRight, ShoppingCart } from 'lucide-react'

type propType = {
    nextStep: (s:number) => void
}
const Welcome = ({nextStep}:propType) => {
  return (
    <div className='flex flex-col justify-center items-center h-screen text-center p-6'>

        <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} transition={{duration: 1}} className="flex items-center gap-3">
            <ShoppingCart className="w-10 h-10 text-blue-600"/>
            <h1 className="text-4xl md:text-5xl text-blue-700 font-extrabold">Grocery Cart</h1>
        </motion.div>

        <motion.p initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 1}} className="mt-4 text-gray-700 text-lg md:text-xl max-w-lg">
            Your one stop for fresh groceries and organic products. Get groceries delivered right at your doorstep.
        </motion.p>

        <motion.button initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} transition={{duration: 1, delay: 0.2}} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 mt-8 cursor-pointer" onClick={() => nextStep(2)}>
            Next
            <ArrowRight />
        </motion.button>
    </div>
  )
}

export default Welcome