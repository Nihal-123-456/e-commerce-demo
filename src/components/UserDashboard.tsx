import React from 'react'
import HeroSection from './HeroSection'
import CategorySlider from './CategorySlider'
import connectDb from '@/lib/db'
import Grocery from '@/models/grocery.model'
import GroceryItemCard from './GroceryItemCard'

type GroceryItem = {
  _id?: string
  name: string
  category: string
  price: string
  unit: string
  image: string
}

const UserDashboard = async () => {
  await connectDb()
  const groceries = await Grocery.find({})
  const plainGrocery = JSON.parse(JSON.stringify(groceries)) as GroceryItem[]
  return (
    <main className='min-h-screen bg-linear-to-b from-slate-50 via-blue-50/60 to-white pb-16'>
      <HeroSection/>
      <CategorySlider/>
      <section className='mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
        <div className='mb-6 flex items-end justify-between gap-4'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.18em] text-blue-600'>Browse</p>
            <h2 className='mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl'>Grocery Items</h2>
          </div>
          <p className='text-sm font-medium text-slate-500'>
            {plainGrocery.length} items available
          </p>
        </div>
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {plainGrocery.map((item) => (
            <GroceryItemCard item={item} key={item._id ?? item.name}/>
          ))}
        </div>
      </section>
    </main>
  )
}

export default UserDashboard
