'use client'

import RegisterForm from '@/components/RegisterForm'
import Welcome from '@/components/Welcome'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Register = () => {
  const [step, setStep] = useState(1)
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/')
    }
  }, [router, status])

  if (status === 'loading' || status === 'authenticated') {
    return null
  }

  return (
    <>
      {step === 1 ? <Welcome nextStep={setStep}/> : <RegisterForm previousStep={setStep}/>}
    </>
  )
}

export default Register