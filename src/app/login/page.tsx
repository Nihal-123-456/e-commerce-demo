'use client'

import { Key, Loader2, LogIn, Mail, ArrowLeft } from 'lucide-react'
import React, {useEffect, useState} from 'react'
import { motion } from "motion/react"
import GoogleImage from "@/assets/google_logo.png"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const { status } = useSession()

    useEffect(() => {
        if (status === 'authenticated') {
            router.replace('/')
        }
    }, [router, status])

    const handleSignin = async (e:React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const result = await signIn("credentials", { email, password, redirect: false })

            if (result?.error) {
                setError("Invalid email or password")
                return
            }

            router.replace("/")
        } catch (error) {
            console.error(error)
            setError("Unable to sign you in right now")
        } finally {
            setLoading(false)
        }
    }
  
    if (status === 'loading' || status === 'authenticated') {
        return null
    }

    return (
      <div className='bg-white'>
      <div className="flex items-center justify-between gap-4 px-10 pt-10">
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
      <div className="flex flex-col items-center justify-center min-h-screen px-6 relative">
          <motion.h1 initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} transition={{duration: 1}} className="text-4xl font-extrabold text-blue-700 mb-2">
              Welcome back!
          </motion.h1>
          <motion.p initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 1}} className="text-gray-600 mb-8 font-medium">Login to your Account</motion.p>
  
          <motion.form initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}} className="flex flex-col gap-5 w-full max-w-sm" onSubmit={handleSignin}>
              <div className="relative">
                  <Mail className="w-5 h-5 absolute top-3.5 left-3 text-gray-400" />
                  <input type="email" placeholder="Enter your email" className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800" onChange={(e) => setEmail(e.target.value)} value={email}/>
              </div>
              <div className="relative">
                  <Key className="w-5 h-5 absolute top-3.5 left-3 text-gray-400" />
                  <input type="password" placeholder="Enter your password" className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800" onChange={(e) => setPassword(e.target.value)} value={password}/>
              </div>
  
              {
                  (() => {
                      const formValidation = email!=="" && password!==""
                      return <button disabled={!formValidation || loading} className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${
                          formValidation ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}>
                          {loading ? <Loader2 className='w-5 h-5 animate-spin'/> : "Login"}
                      </button>
                  })()
              }
  
              {error ? (
                  <p className="text-sm text-red-600 text-center">{error}</p>
              ) : null}

              <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                  <span className="flex-1 h-px bg-gray-200"></span>
                  OR
                  <span className="flex-1 h-px bg-gray-200"></span>
              </div>
  
              <div className="w-full font-medium py-3 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-3 hover:bg-gray-50 text-gray-500 border border-gray-300 cursor-pointer" onClick={() => signIn("google", {callbackUrl: "/"})}>
                  <Image src={GoogleImage} alt="google logo" width={20} height={20}/>
                  Continue with Google
              </div>
          </motion.form>
  
          <p className="text-gray-600 text-sm mt-6 flex items-center gap-1 cursor-pointer" onClick={()=>router.push("/register")}>
              Dont have an account? <LogIn className="w-4 h-4"/>
              <span className="text-blue-600">Sign up</span>
          </p>
      </div>
      </div>
    )
}

export default Login