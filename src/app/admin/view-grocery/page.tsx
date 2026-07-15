'use client'

import axios from "axios"
import React, { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, type Variants } from "motion/react"
import { ArrowLeft, Loader, Package, Pencil, Search, Upload, X, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { IGrocery } from "@/models/grocery.model"
import Image from "next/image"

const ViewGrocery = () => {
  const router = useRouter()
  const [groceries, setGroceries] = useState<IGrocery[]>([])
  const [editing, setEditing] = useState<IGrocery | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState<IGrocery[]>([])
  const [backendImage, setBackendImage] = useState<Blob | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const categories = ["Fruits & Vegetables", "Dairy & Eggs", "Rice & Grains", "Snacks & Biscuits", "Spices & Masalas", "Beverages & Drinks", "Personal Care", "Household Essentials", "Package Food", "Baby & Pet Care"]
  const units = ["kg", "g", "liter", "ml", "piece", "pack"]

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.08 },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  const modalVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.98 },
  }

  useEffect(() => {
    const getGroceries = async () => {
      try {
        const result = await axios.get("/api/admin/get-groceries")
        setGroceries(result.data ?? [])
        setFiltered(result.data ?? [])
      } catch (error) {
        console.log(error)
      }
    }
    getGroceries()
  }, [])

  const startEditing = (grocery: IGrocery) => {
    setEditing(grocery)
    setImagePreview(grocery.image ?? null)
  }

  const closeEditor = () => {
    setEditing(null)
    setImagePreview(null)
    setBackendImage(null)
  }

  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(file){
      setBackendImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleEdit = async () => {
    if(!editing) return
    const groceryId = editing._id?.toString()
    if(!groceryId) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("groceryId", groceryId)
      formData.append("name", editing.name)
      formData.append("category", editing.category)
      formData.append("price", editing.price)
      formData.append("unit", editing.unit)
      if(backendImage){
        formData.append("image", backendImage)
      }
      await axios.post("/api/admin/edit-grocery", formData)
      window.location.reload()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if(!editing) return
    setDeleteLoading(true)
    try {
      await axios.post("/api/admin/delete-grocery", {groceryId: editing._id})
      window.location.reload()
    } catch (error) {
      console.log(error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSearch = (e:React.FormEvent) => {
    e.preventDefault()
    const q = search.toLowerCase()
    setFiltered(
      groceries.filter(
        (g) => g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)
      )
    )
  }

  const totalCount = useMemo(() => filtered.length, [filtered.length])

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-blue-50/70 to-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 font-medium text-blue-700 shadow-sm shadow-blue-100/70 transition-colors hover:bg-blue-50 hover:text-blue-800"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </motion.button>

          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Package size={16} />
            {totalCount} groceries
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-8 rounded-3xl border border-blue-100 bg-white px-6 py-6 shadow-lg shadow-blue-100/60 sm:px-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Admin inventory</p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-900 sm:text-4xl">Manage Groceries</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Search, edit, and remove grocery items with a clean overview of the catalog.
              </p>
            </div>

            <motion.form
              onSubmit={handleSearch}
              className="flex w-full flex-col gap-3 sm:max-w-xl sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search by name or category"
                  onChange={(e)=>setSearch(e.target.value)}
                  value={search}
                  className="w-full rounded-2xl border border-blue-100 bg-blue-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-md shadow-blue-300/60 transition-colors hover:bg-blue-700"
              >
                Search
              </motion.button>
            </motion.form>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {filtered.map((g) => (
            <motion.div
              key={g._id?.toString()}
              variants={cardVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg shadow-blue-100/60"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-blue-50">
                <Image src={g.image} alt={g.name} fill className="object-cover transition-transform duration-500 hover:scale-105" />
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <p className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                    {g.category}
                  </p>
                  <h3 className="mt-3 text-xl font-extrabold leading-7 text-slate-900">{g.name}</h3>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-black text-blue-700">
                    Tk {g.price} <span className="text-sm font-semibold text-slate-500">/ {g.unit}</span>
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 420, damping: 22 }}
                    onClick={() => startEditing(g)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-300/60 transition-colors hover:bg-blue-700"
                  >
                    <Pencil size={15} />
                    Edit
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm"
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-blue-100 bg-white shadow-2xl shadow-blue-200/50"
              >
                <div className="flex items-center justify-between border-b border-blue-100/80 px-6 py-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Edit grocery</p>
                    <h2 className="mt-1 text-2xl font-black text-slate-900">Update item details</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeEditor}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    <X size={18} />
                  </motion.button>
                </div>

                <div className="grid gap-6 p-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                  <div className="space-y-4">
                    <div className="relative aspect-4/4 overflow-hidden rounded-3xl border border-blue-100 bg-blue-50">
                      {imagePreview && (
                        <Image src={imagePreview} alt={editing.name} fill className="object-cover" />
                      )}
                      <label
                        htmlFor="imageUpload"
                        className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 bg-slate-950/35 text-white transition-colors hover:bg-slate-950/45"
                      >
                        <Upload size={28} />
                        <span className="text-sm font-semibold">Upload image</span>
                      </label>
                      <input id="imageUpload" type="file" accept="image/*" hidden onChange={handleImageChange}/>
                    </div>

                    <div className="rounded-2xl bg-blue-50/60 px-4 py-3 text-sm text-slate-600">
                      Preview and update the product image, then save the changes.
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Enter grocery name"
                        value={editing.name}
                        onChange={(e)=>setEditing({...editing, name: e.target.value})}
                        className="w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                      <select
                        value={editing.category}
                        onChange={(e)=>setEditing({...editing, category: e.target.value})}
                        className="w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option value={c} key={c}>{c}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Enter price"
                        value={editing.price}
                        onChange={(e)=>setEditing({...editing, price: e.target.value})}
                        className="w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                      <select
                        value={editing.unit}
                        onChange={(e)=>setEditing({...editing, unit: e.target.value})}
                        className="w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      >
                        <option value="">Select Unit</option>
                        {units.map((c) => (
                          <option value={c} key={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 420, damping: 22 }}
                        onClick={handleEdit}
                        disabled={loading}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-md shadow-blue-300/60 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                      >
                        {loading ? <Loader size={14} className="animate-spin" /> : "Save changes"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 420, damping: 22 }}
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3.5 font-semibold text-rose-700 shadow-sm shadow-rose-100/60 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {deleteLoading ? <Loader size={14} className="animate-spin" /> : <Trash2 size={16} />}
                        Delete Grocery
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ViewGrocery
