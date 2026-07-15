'use client'

import { getSocket } from '@/lib/socket'
import axios from 'axios'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { CheckCircle2, CircleSlash, MapPin, PackageCheck, Truck, Loader } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import LiveMap from './LiveMap'
import DeliveryChat from './DeliveryChat'
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend } from 'recharts'

type Assignment = {
  _id: string,
  order: {
    _id: string
    address: {
      fullAddress: string
    }
  }
}
interface ILocation {
  latitude: number, 
  longitude: number
}

const DeliveryManDashboard = ({earning}:{earning:number}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const {userData} = useSelector((state:RootState)=>state.user)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeOrder, setActiveOrder] = useState<any>(null)
  const [userLocation, setUserLocation] = useState<ILocation>({latitude:0, longitude:0})
  const [deliveryLocation, setDeliveryLocation] = useState<ILocation>({latitude:0, longitude:0})
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [sendOtpLoading, setSendOtpLoading] = useState(false)
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false)

  const handleAccept = async (id:string) => {
    try {
      const result = await axios.get(`/api/delivery/assignment/${id}/accept-assignment`)
      await fetchCurrentOrder()
    } catch (error) {
      console.log(error);
    }
  }

  const fetchCurrentOrder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order")
      if(result.data.active){
        setActiveOrder(result.data.assignment)
        setUserLocation({
          latitude: result.data.assignment.order.address.latitude,
          longitude: result.data.assignment.order.address.longitude
        })
      }
    } catch (error) {
      console.log(error);
    }
  }
  const fetchAssignments = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignments")
      setAssignments(result.data ?? [])
    } catch (error) {
      console.log(error)
      setAssignments([])
    }
  }
  const sendOtp = async () => {
    setSendOtpLoading(true)
    try {
      const result = await axios.post("/api/delivery/otp/send", {orderId: activeOrder.order._id})
      setShowOtpBox(true)
      setSendOtpLoading(false)
    } catch (error) {
      console.log(error);
      setSendOtpLoading(false)
    }
  }
  const verifyOtp = async () => {
    setVerifyOtpLoading(true)
    try {
      const result = await axios.post("/api/delivery/otp/verify", {orderId: activeOrder.order._id, otp})
      setActiveOrder(null)
      setVerifyOtpLoading(false)
      setOtp("")
      setShowOtpBox(false)
      await fetchCurrentOrder()
      window.location.reload()
    } catch (error) {
      setOtpError('Otp Verification error')
      setVerifyOtpLoading(false)
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.08 },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  useEffect(() => {
    let cancelled = false

    const loadDashboardData = async () => {
      if (cancelled) return
      await Promise.all([fetchAssignments(), fetchCurrentOrder()])
    }

    const timeoutId = window.setTimeout(() => {
      void loadDashboardData()
    }, 0)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [userData])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEffect(():any => {
    const socket = getSocket()
    socket.on("new-assignment", (deliveryAssignment) => {
      setAssignments((prev) => [...prev, deliveryAssignment])
    })
    return () => socket.off("new-assignment")
  }, [])

  useEffect(() => {
    const socket = getSocket()
    if(!userData?._id) return
    if(!navigator.geolocation) return
    const watcher = navigator.geolocation.watchPosition((pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        setDeliveryLocation({
          latitude: lat, longitude: lon
        })
        socket.emit("update-location", {
            userId: userData?._id, latitude:lat, longitude:lon
        })
    }, (err) => {
        console.log(err);
    }, {enableHighAccuracy: true})
    return ()=>navigator.geolocation.clearWatch(watcher)
  }, [userData?._id])

  useEffect(() => {
    const socket = getSocket()
    socket.on("update-deliveryMan-locaton", ({userId, location}) => {
      setDeliveryLocation({
        latitude: location.coordinates[1],
        longitude: location.coordinates[0]
      })
    })
    return () => {
      socket.off("update-deliveryMan-locaton")
    }
  }, [])

  const todayEarning = [
    {
      name: "Today", earning: earning, deliveries: earning/50
    }
  ]

  if(activeOrder && userLocation) {
    return (
      <div id='delivery-tracking' className='min-h-screen bg-linear-to-b from-slate-50 via-blue-50/70 to-white px-4 py-30 sm:px-6 lg:px-8'>
        <div className='mx-auto flex w-full max-w-6xl flex-col gap-6'>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className='rounded-3xl border border-blue-100 bg-white px-6 py-6 shadow-lg shadow-blue-100/60 sm:px-8'
          >
            <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <p className='text-sm font-semibold uppercase tracking-[0.18em] text-blue-600'>Active delivery</p>
                <h1 className='mt-2 text-3xl font-black tracking-normal text-slate-900 sm:text-4xl'>On the road</h1>
                <p className='mt-2 text-sm font-medium text-slate-500'>
                  Active Order #{activeOrder.order._id.slice(-6)}
                </p>
              </div>

              <div className='inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700'>
                <Truck size={16} />
                Live tracking
              </div>
            </div>
          </motion.div>

          <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start'>
            <div className='overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-xl shadow-blue-100/60'>
              <div className='border-b border-blue-100/80 px-5 py-4 sm:px-6'>
                <p className='text-sm font-semibold uppercase tracking-[0.18em] text-blue-600'>Tracking map</p>
                <p className='mt-1 text-sm text-slate-500'>
                  Compare your live location with the customer location in real time.
                </p>
              </div>
              <div className='p-4 sm:p-5'>
                <LiveMap userLocation={userLocation} deliveryLocation={deliveryLocation}/>
              </div>

              <DeliveryChat orderId={activeOrder.order._id} senderId={userData?._id}/>

              <div className='mt-6 bg-white rounded-xl shadow p-6'>
                {!activeOrder.order.deliveryOtpVerification && !showOtpBox && <button className="text-center w-full py-4 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700" onClick={sendOtp}>{sendOtpLoading ? <Loader size={16} className="animate-spin text-white"/> : "Mark as Delivered"}</button>}
                {
                  showOtpBox && <div className='mt-4'>
                    <input type="text" maxLength={4} placeholder='Enter Otp' className='w-full py-3 border rounded-lg text-center' onChange={(e) => setOtp(e.target.value)} value={otp}/>
                    <button className='w-full text-center mt-4 bg-blue-600 text-white py-3 rounded-lg' onClick={verifyOtp}>{verifyOtpLoading ? <Loader size={16} className="animate-spin text-white"/> : "Verify otp"}</button>
                    {otpError && <div className='mt-2 text-red-600'>{otpError}</div>}
                  </div>
                }

                {
                  activeOrder.order.deliveryOtpVerification && <div className='text-green-700 text-center font-bold'>Delivery Completed !</div>
                }
                
              </div>
            </div>

            <div className='rounded-3xl border border-blue-100 bg-white p-5 shadow-lg shadow-blue-100/60 sm:p-6'>
              <div className='flex items-center gap-3 rounded-2xl bg-blue-50/70 p-4'>
                <PackageCheck className='h-10 w-10 shrink-0 rounded-2xl bg-white p-2 text-blue-700 shadow-sm shadow-blue-100/60' />
                <div className='min-w-0'>
                  <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'>Current task</p>
                  <p className='mt-1 text-sm font-semibold text-slate-800'>Navigate to the delivery address and complete the drop-off.</p>
                </div>
              </div>

              <div className='mt-5 space-y-3'>
                <div className='rounded-2xl bg-blue-50/50 px-4 py-3 text-sm leading-6 text-slate-600'>
                  Keep the map open while you travel. The route line updates based on your live location.
                </div>
                <div className='rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-medium text-slate-700'>
                  Customer order is ready for delivery tracking.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-blue-50/70 to-white px-4 py-30 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-8 rounded-3xl border border-blue-100 bg-white px-6 py-6 shadow-lg shadow-blue-100/60 sm:px-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Delivery panel</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-900 sm:text-4xl">Delivery Assignments</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Review incoming assignments, check the delivery address, and act on each order quickly.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Truck size={16} />
              {assignments.length} active
            </div>
          </div>
        </motion.div>

        {assignments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-blue-100 bg-white px-6 py-14 text-center shadow-lg shadow-blue-100/60"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <PackageCheck className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">No assignments yet</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              New delivery orders will appear here as soon as they are assigned to you.
            </p>
            <div
              id="delivery-man-earning"
              className="mt-6 overflow-hidden rounded-3xl border border-blue-100 bg-white p-5 text-left shadow-lg shadow-blue-100/60 sm:p-6 w-full"
            >
              <div className="flex flex-col gap-4 border-b border-blue-100/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Today performance</p>
                  <h2 className="mt-2 text-2xl font-black tracking-normal text-slate-900">Earnings overview</h2>
                </div>
                <div className="rounded-2xl bg-blue-50 px-4 py-3 text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Total earned</p>
                  <p className="mt-1 text-2xl font-black text-blue-700">Tk {earning}</p>
                </div>
              </div>

              <div className="mt-5 h-72 overflow-hidden rounded-3xl border border-blue-100 bg-blue-50/30 p-3 sm:h-80 sm:p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={todayEarning} barSize={28} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="#dbeafe" strokeDasharray="4 4" vertical={false} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      width={28}
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(219, 234, 254, 0.45)' }}
                      contentStyle={{
                        borderRadius: '16px',
                        border: '1px solid #dbeafe',
                        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.12)',
                        background: '#ffffff',
                      }}
                      labelStyle={{ color: '#0f172a', fontWeight: 700 }}
                      itemStyle={{ color: '#2563eb', fontWeight: 600 }}
                    />
                    <Legend />
                    <Bar
                      dataKey="deliveries"
                      fill="#2563eb"
                      radius={[10, 10, 0, 0]}
                      activeBar={{ fill: '#1d4ed8' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-slate-600">
                  Tk {earning} earned today
                </p>
                <button
                  onClick={()=>window.location.reload()}
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-300/60 transition-colors hover:bg-blue-700"
                >
                  Refresh Earning
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-5"
          >
            <AnimatePresence mode="popLayout">
              {assignments.map((a) => (
                <motion.div
                  key={a.order._id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  layout
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg shadow-blue-100/60"
                >
                  <div className="flex flex-col gap-4 border-b border-blue-100/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="min-w-0 space-y-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-sm shadow-blue-300/60">
                        <Truck size={14} />
                        Assignment #{a.order._id.slice(-6)}
                      </div>
                      <div className="flex items-start gap-2 rounded-2xl bg-blue-50/70 px-4 py-3">
                        <MapPin size={16} className="mt-0.5 shrink-0 text-blue-700" />
                        <span className="min-w-0 wrap-break-word text-sm font-medium leading-6 text-slate-700">
                          {a.order.address.fullAddress}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                        Ready
                      </span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                        Delivery task
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-6">
                    <div className="rounded-2xl bg-blue-50/50 p-4 text-sm leading-6 text-slate-600">
                      <p className="font-semibold text-slate-800">Order details</p>
                      <p className="mt-1">
                        Pick up the order, confirm the customer address, and update the delivery status after completion.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:min-w-55">
                      <motion.button
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 420, damping: 22 }}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-md shadow-blue-300/60 transition-colors hover:bg-blue-700" onClick={()=>handleAccept(a._id.toString())}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        Accept
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 420, damping: 22 }}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-white px-4 py-3 font-semibold text-blue-700 shadow-sm shadow-blue-100/60 transition-colors hover:bg-blue-50"
                      >
                        <CircleSlash className="h-5 w-5" />
                        Reject
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default DeliveryManDashboard
