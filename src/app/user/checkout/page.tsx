'use client'

import type { LatLngExpression } from "leaflet"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import { RootState } from "@/redux/store"
import { ArrowLeft, Building, CreditCard, CreditCardIcon, Home, Loader2, LocateFixed, MapPin, Navigation, Phone, Search, Truck, User } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import { useRouter } from "next/navigation"

const LeafletMap = dynamic(
  async () => {
    const [{ MapContainer, Marker, TileLayer, useMap }, { default: L }] = await Promise.all([
      import("react-leaflet"),
      import("leaflet"),
    ])

    const markerIcon = new L.Icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/128/10473/10473293.png",
      iconSize: [20, 40],
      iconAnchor: [20, 40],
    })

    type DraggableMarkerProps = {
      position: [number, number] | null
      onPositionChange: (position: [number, number]) => void
    }

    const DraggableMarker = ({ position, onPositionChange }: DraggableMarkerProps) => {
      const map = useMap()

      useEffect(() => {
        if (position) {
          map.setView(position as LatLngExpression, 15, { animate: true })
        }
      }, [position, map])

      if (!position) return null

      return (
        <Marker
          icon={markerIcon}
          position={position as LatLngExpression}
          draggable={true}
          eventHandlers={{
            dragend: (e: L.LeafletEvent) => {
              const marker = e.target as L.Marker
              const { lat, lng } = marker.getLatLng()
              onPositionChange([lat, lng])
            },
          }}
        />
      )
    }

    const LeafletMapContent = ({
      position,
      onPositionChange,
    }: {
      position: [number, number] | null
      onPositionChange: (position: [number, number]) => void
    }) => (
      <MapContainer
        center={position as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker position={position} onPositionChange={onPositionChange} />
      </MapContainer>
    )

    return LeafletMapContent
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center rounded-xl border border-blue-100 bg-blue-50/50 text-blue-400">
        Loading map…
      </div>
    ),
  }
)

const inputBase =
  "w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"

const iconWrap =
  "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"

const Checkout = () => {
  const router = useRouter()
  const { userData } = useSelector((state: RootState) => state.user)
  const { subTotal, deliveryFee, finalTotal, cartData } = useSelector((state: RootState) => state.cart)
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  })

  const [searchLoading, setSearchLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod")

  const handleSearchQuery = async () => {
    setSearchLoading(true)
    if (!searchQuery.trim()) return
    const { OpenStreetMapProvider } = await import("leaflet-geosearch")
    const provider = new OpenStreetMapProvider()
    const results = await provider.search({ query: searchQuery })

    if (results?.length) {
      setSearchLoading(false)
      setPosition([results[0].y, results[0].x])
    }
  }

  const [position, setPosition] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setPosition([latitude, longitude])
        },
        (err) => { console.log(err) },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      )
    }
  }, [])

  useEffect(() => {
    if (userData) {
      const updateAddress = () => {
          setAddress((prev) =>({...prev, fullName: userData.name || ""}))
          setAddress((prev) =>({...prev, mobile: userData.mobile || ""}))
      }
      updateAddress()
    }
  }, [userData])

  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) return
      try {
        const result = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`
        )
        const a = result.data.address
        setAddress((prev) => ({
          ...prev,
          city: a.city || a.town || a.village || a.municipality || "",
          state: a.state || "",
          pincode: a.postcode || "",
          fullAddress: result.data.display_name || "",
        }))
      } catch (error) {
        console.log(error)
      }
    }
    fetchAddress()
  }, [position])

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setPosition([latitude, longitude])
        },
        (err) => { console.log(err) },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      )
    }
  }

  const handleOnlinePayment = async () => {
    if(!position) return null
    try {
      const result = await axios.post("/api/user/payment", {
        userId: userData?._id,
        items: cartData.map(item => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: finalTotal,
        address: {
          fullName: address.fullName,
          mobile: address.mobile,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          fullAddress: address.fullAddress,
          latitude: position[0],
          longitude: position[1]
        },
        paymentMethod
      })
      window.location.href = result.data.url
    } catch(err) {
      console.log(err);
    }
  }

  const handleCod = async () => {
    if(!position) return null
    try {
      const result = await axios.post("/api/user/order", {
        userId: userData?._id,
        items: cartData.map(item => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: finalTotal,
        address: {
          fullName: address.fullName,
          mobile: address.mobile,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          fullAddress: address.fullAddress,
          latitude: position[0],
          longitude: position[1]
        },
        paymentMethod
      })
      router.push("/user/order-success")
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 px-4 pb-16 pt-8">
      {/* Back button */}
      <Link
        href="/user/cart"
        className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm shadow-blue-100/70 transition-colors hover:bg-blue-50 hover:text-blue-800"
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Back to Cart</span>
      </Link>

      {/* Page heading */}
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
      >
        Checkout
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mt-1 text-center text-sm text-gray-500"
      >
        Review your delivery details and complete your order
      </motion.p>

      <div className="mx-auto mt-10 grid max-w-6xl gap-6 lg:grid-cols-[1fr_380px]">
        {/* ── Left column: Delivery Address ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/40"
        >
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-800">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <MapPin size={16} className="text-blue-600" />
            </span>
            Delivery Address
          </h2>

          <div className="space-y-4">
            {/* Full name */}
            <div className="relative">
              <span className={iconWrap}><User size={16} /></span>
              <input
                type="text"
                placeholder="Full Name"
                value={address.fullName}
                onChange={(e) => setAddress((prev) => ({ ...prev, fullName: e.target.value }))}
                className={inputBase}
              />
            </div>

            {/* Mobile */}
            <div className="relative">
              <span className={iconWrap}><Phone size={16} /></span>
              <input
                type="text"
                placeholder="Mobile Number"
                value={address.mobile}
                onChange={(e) => setAddress((prev) => ({ ...prev, mobile: e.target.value }))}
                className={inputBase}
              />
            </div>

            {/* Full address */}
            <div className="relative">
              <span className={iconWrap}><Home size={16} /></span>
              <input
                type="text"
                placeholder="Full Address"
                value={address.fullAddress}
                onChange={(e) => setAddress((prev) => ({ ...prev, fullAddress: e.target.value }))}
                className={inputBase}
              />
            </div>

            {/* City / State / Pincode row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <span className={iconWrap}><Building size={16} /></span>
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
                  className={inputBase}
                />
              </div>
              <div className="relative">
                <span className={iconWrap}><Navigation size={16} /></span>
                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))}
                  className={inputBase}
                />
              </div>
              <div className="relative">
                <span className={iconWrap}><Search size={16} /></span>
                <input
                  type="text"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) => setAddress((prev) => ({ ...prev, pincode: e.target.value }))}
                  className={inputBase}
                />
              </div>
            </div>

            {/* Map search bar */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search city or area on map…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchQuery()}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <motion.button
                onClick={handleSearchQuery}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                className="flex min-w-20 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-colors hover:bg-blue-700"
              >
                {searchLoading ? <Loader2 size={16} className="animate-spin" /> : <><Search size={14} /> Search</>}
              </motion.button>
            </div>

            {/* Map */}
            <div className="relative overflow-hidden rounded-xl border border-blue-100 shadow-sm" style={{ height: 280 }}>
              {position && <LeafletMap position={position} onPositionChange={setPosition} />}
              <motion.button
                onClick={handleCurrentLocation}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="absolute bottom-3 right-3 z-500 flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-blue-700 shadow-lg shadow-blue-100 ring-1 ring-blue-100 transition-colors hover:bg-blue-50"
              >
                <LocateFixed size={15} />
                My Location
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── Right column: Payment + Summary ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col gap-5"
        >
          {/* Payment method card */}
          <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/40">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <CreditCard size={16} className="text-blue-600" />
              </span>
              Payment Method
            </h2>

            <div className="flex flex-col gap-3">
              {/* Online payment button */}
              <motion.button
                onClick={() => setPaymentMethod("online")}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-sm font-semibold transition-all ${
                  paymentMethod === "online"
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100"
                    : "border-slate-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50/50"
                }`}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${paymentMethod === "online" ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                  <CreditCardIcon size={17} />
                </span>
                <div className="text-left">
                  <div>Pay Online</div>
                  <div className="text-xs font-normal text-gray-500">Secure payment via Stripe</div>
                </div>
                {paymentMethod === "online" && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                    <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                )}
              </motion.button>

              {/* COD button */}
              <motion.button
                onClick={() => setPaymentMethod("cod")}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-sm font-semibold transition-all ${
                  paymentMethod === "cod"
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100"
                    : "border-slate-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50/50"
                }`}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${paymentMethod === "cod" ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                  <Truck size={17} />
                </span>
                <div className="text-left">
                  <div>Cash on Delivery</div>
                  <div className="text-xs font-normal text-gray-500">Pay when your order arrives</div>
                </div>
                {paymentMethod === "cod" && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                    <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Order summary card */}
          <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/40">
            <h2 className="mb-4 text-base font-bold text-gray-800">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-800">Tk {subTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-800">Tk {deliveryFee}</span>
              </div>
              <div className="my-1 border-t border-dashed border-slate-200" />
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span className="text-blue-700">Tk {finalTotal}</span>
              </div>
            </div>
          </div>

          {/* Place order CTA */}
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-full rounded-xl bg-linear-to-r from-blue-600 to-blue-700 py-4 text-base font-bold text-white shadow-lg shadow-blue-300/50 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-300/70" onClick={()=>{
              if(paymentMethod == "cod"){
                handleCod()
              } else {
                handleOnlinePayment()
              }
            }}
          >
            {paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default Checkout
