'use client'

import { AppDispatch } from '@/redux/store'
import { setUserData } from '@/redux/userSlice'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetMe = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { status } = useSession()

  useEffect(() => {
    if (status !== 'authenticated') {
      if (status === 'unauthenticated') {
        dispatch(setUserData(null))
      }
      return
    }

    let isActive = true

    const fetchMe = async () => {
      try {
        const result = await axios.get('/api/me')
        if (isActive) {
          dispatch(setUserData(result.data))
        }
      } catch (error) {
        console.log(error)
        if (isActive) {
          dispatch(setUserData(null))
        }
      }
    }

    fetchMe()

    return () => {
      isActive = false
    }
  }, [dispatch, status])
}

export default useGetMe