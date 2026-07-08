'use client'

import React, { useState } from 'react'
import { motion } from "motion/react"
import { Bike, Icon, User, UserCog } from 'lucide-react'

const EditRoleMobile = () => {
  const [roles, setRoles] = useState([{id: "admin", label: "Admin", icon: UserCog},{id: "user", label: "User", icon:User}, {id: "deliveryMan", label: "Delivery Man", icon:Bike}])
  const [selectedRole, setSelectedRole] = useState("")
  const [mobile, setMobile] = useState("")

  return (
    <div className="flex flex-col items-center min-h-screen p-6 w-full bg-white">
        <motion.h1 initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} transition={{duration: 1}} className="text-3xl md:text-4xl font-extrabold text-blue-700 text-center mt-8">Select Your Role</motion.h1>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
            {roles.map((role) => {
                const Icon = role.icon
                const isSelected = selectedRole === role.id
                return (
                    <motion.div className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2 transition-all ${
                        isSelected? "bg-blue-100 shadow-lg border-blue-600" : "bg-white border-gray-300 hover:border-blue-400"
                    }`} key={role.id} whileTap={{scale: 0.95}} onClick={() => setSelectedRole(role.id)}>
                        <Icon/>
                        <span>{role.label}</span>
                    </motion.div>
                )
            })}
        </div>

        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}} className='flex flex-col items-center mt-10'>
            <label htmlFor="mobile" className="text-gray-700 font-medium mb-2">Enter Mobile Number</label>
            <input type="tel" id="mobile" className="w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800" placeholder="Enter your mobile number" onChange={(e) => setMobile(e.target.value)}/>
        </motion.div>

        <motion.button initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 1}} className = {`inline-flex items-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 mt-10 ${
            selectedRole && mobile.length >= 10 ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`} disabled={!selectedRole || !(mobile.length >= 10)}>
            Go to Home
        </motion.button>
    </div>
  )
}

export default EditRoleMobile
