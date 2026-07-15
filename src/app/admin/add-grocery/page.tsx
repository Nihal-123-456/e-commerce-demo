"use client"

import { ArrowLeft, Loader, PlusCircle, Upload } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ChangeEvent, FormEvent, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const AddGrocery = () => {
  const fieldVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  }

  const categories = [
    "Fruits & Vegetables", "Dairy & Eggs", "Rice & Grains", "Snacks & Biscuits", "Spices & Masalas", "Beverages & Drinks", "Personal Care", "Household Essentials", "Package Food", "Baby & Pet Care"
  ]
  const units = [
    "kg", "g", "liter", "ml", "piece", "pack"
  ]
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [unit, setUnit] = useState("")
  const [price, setPrice] = useState("")
  const [preview, setPreview] = useState<string|null>()
  const [backendImage, setBackendImage] = useState<File|null>()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleImageChange = (e:ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if(!files || files.length == 0) return
    const file = files[0]
    setBackendImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try{
        const formData = new FormData()
        formData.append("name", name)
        formData.append("category", category)
        formData.append("price", price)
        formData.append("unit", unit)
        if(backendImage){
            formData.append("image", backendImage)
        }
        await axios.post("/api/admin/add-grocery", formData)
        setLoading(false)
        router.replace("/admin/view-grocery")
    } catch(error) {
        console.log(error);
        setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-white py-20 px-4 relative'>
        <Link href={"/"} className='absolute top-6 left-6 flex items-center gap-2 text-blue-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-blue-100 hover:shadow-lg transition-all'>
            <ArrowLeft className='w-5 h-5'/>
            <span className='hidden md:flex'>Back to home</span> 
        </Link>
        <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className='w-full max-w-2xl rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-2xl shadow-blue-200/50 backdrop-blur sm:p-8 lg:p-10'
        >
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.45 }}
                className='mb-8 text-center'
            >
                <div className='mb-3 flex items-center justify-center gap-3 text-blue-700'>
                    <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 shadow-inner shadow-blue-200'>
                        <PlusCircle className='h-7 w-7'/>
                    </span>
                    <h1 className='text-2xl font-extrabold tracking-normal text-blue-800 sm:text-3xl'>Add Your Grocery</h1>
                </div>
                <p className='text-sm font-medium text-slate-500 sm:text-base'>Fill out the details below to add grocery</p>
            </motion.div>
            <motion.form
                onSubmit={handleSubmit}
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.09, delayChildren: 0.25 }}
                className='space-y-5'
            >
                <motion.div variants={fieldVariants} className='space-y-2'>
                    <label htmlFor="name" className='text-sm font-semibold text-slate-700'>Your Grocery Name <span className='text-blue-600'>*</span></label>
                    <input className='w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100' type="text" id='name' placeholder='Grocery name' onChange={(e) => setName(e.target.value)} value={name}/>
                </motion.div>
                <motion.div variants={fieldVariants} className='grid gap-5 sm:grid-cols-2'>
                    <div className='space-y-2'>
                        <label htmlFor="category" className='text-sm font-semibold text-slate-700'>Category <span className='text-blue-600'>*</span></label>
                        <select id='category' name="category" className='w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-slate-800 outline-none transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100' onChange={(e) => setCategory(e.target.value)} value={category}>
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option value={cat} key={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor="unit" className='text-sm font-semibold text-slate-700'>Unit <span className='text-blue-600'>*</span></label>
                        <select id='unit' name="unit" className='w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-slate-800 outline-none transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100' onChange={(e) => setUnit(e.target.value)} value={unit}>
                            <option value="">Select Unit</option>
                            {units.map(cat => (
                                <option value={cat} key={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </motion.div>
                <motion.div variants={fieldVariants} className='space-y-2'>
                    <label htmlFor="price" className='text-sm font-semibold text-slate-700'>Price <span className='text-blue-600'>*</span></label>
                    <input className='w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100' type="text" id='price' placeholder='Grocery price' onChange={(e) => setPrice(e.target.value)} value={price}/>
                </motion.div>
                <motion.div variants={fieldVariants} className='space-y-3'>
                    <label htmlFor="image" className='flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50/60 px-5 py-8 text-center font-semibold text-blue-700 transition-all duration-200 hover:border-blue-400 hover:bg-blue-100/80 sm:flex-row'>
                        <Upload className='h-6 w-6'/>
                        <span>Upload Grocery Image</span>
                    </label>
                    <input type="file" accept='image/*' id='image' hidden onChange={handleImageChange}/>
                    {preview && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className='overflow-hidden rounded-3xl border border-blue-100 bg-white p-2 shadow-lg shadow-blue-100'
                        >
                            <Image className='w-full rounded-2xl object-cover ' src={preview} width={100} height={100} alt='image'/>
                        </motion.div>
                    )}
                </motion.div>

                <motion.button
                    disabled={loading}
                    type='submit'
                    whileHover={!loading ? { scale: 1.03, y: -2 } : undefined}
                    whileTap={!loading ? { scale: 0.98 } : undefined}
                    transition={{ type: "spring", stiffness: 420, damping: 22 }}
                    className='flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-300/60 transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:shadow-none'
                >
                    {loading ? <Loader className='h-5 w-5 animate-spin'/> : "Add Grocery"}
                </motion.button>
            </motion.form>
        </motion.div>
    </div>
  )
}

export default AddGrocery
