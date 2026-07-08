import { ArrowLeft, Key, Loader2, LogIn, Mail, User } from 'lucide-react'
import React, {useState} from 'react'
import { motion } from "motion/react"
import GoogleImage from "@/assets/google_logo.png"
import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

type propType = {
    previousStep: (s:number) => void
}
const RegisterForm = ({previousStep}:propType) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e:React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
        const result = await axios.post('/api/auth/register', {name, email, password})
        router.push("/login")
        setLoading(false)
    } catch(error) {
        console.log(error);
        setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">

        <div className="absolute top-6 left-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer" onClick={() => previousStep(1)}>
            <ArrowLeft className="w-5 h-5"/>
            <span className="font-medium">Back</span>
        </div>

        <motion.h1 initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} transition={{duration: 1}} className="text-4xl font-extrabold text-blue-700 mb-2">
            Create Account
        </motion.h1>
        <motion.p initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 1}} className="text-gray-600 mb-8 font-medium">Join Grocery Cart today</motion.p>

        <motion.form initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}} className="flex flex-col gap-5 w-full max-w-sm" onSubmit={handleRegister}>
            <div className="relative">
                <User className="w-5 h-5 absolute top-3.5 left-3 text-gray-400" />
                <input type="text" placeholder="Enter your name" className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800" onChange={(e) => setName(e.target.value)} value={name}/>
            </div>
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
                    const formValidation = name!=="" && email!=="" && password!==""
                    return <button disabled={!formValidation || loading} className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${
                        formValidation ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}>
                        {loading ? <Loader2 className='w-5 h-5 animate-spin'/> : "Register"}
                    </button>
                })()
            }

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

        <p className="text-gray-600 text-sm mt-6 flex items-center gap-1 cursor-pointer" onClick={()=>router.push("/login")}>
            Already have account? <LogIn className="w-4 h-4"/>
            <span className="text-blue-600">Sign in</span>
        </p>
    </div>
  )
}

export default RegisterForm