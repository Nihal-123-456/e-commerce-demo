'use client'

import React, { useMemo, useState } from 'react'
import HeroSection from './HeroSection'
import CategorySlider from './CategorySlider'
import { IGrocery } from '@/models/grocery.model'
import GroceryItemCard from './GroceryItemCard'

type UserDashboardProps = {
  groceryList: IGrocery[]
}

const UserDashboard = ({ groceryList }: UserDashboardProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const categorySet = new Set<string>()
    groceryList.forEach((item) => {
      if (item.category) {
        categorySet.add(item.category)
      }
    })
    return Array.from(categorySet).sort()
  }, [groceryList])

  const visibleItems = useMemo(() => {
    if (!selectedCategory) {
      return groceryList
    }

    return groceryList.filter((item) => item.category?.toLowerCase() === selectedCategory.toLowerCase())
  }, [groceryList, selectedCategory])

  return (
    <main className='min-h-screen bg-linear-to-b from-slate-50 via-blue-50/60 to-white pb-16'>
      <HeroSection />
      <CategorySlider
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <section className='mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
        <div className='mb-6 flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='text-sm font-semibold uppercase tracking-[0.18em] text-blue-600'>Browse</p>
            <h2 className='mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl'>Grocery Items</h2>
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            {selectedCategory ? (
              <button
                type='button'
                onClick={() => setSelectedCategory(null)}
                className='rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50'
              >
                Show all products
              </button>
            ) : null}
            <p className='text-sm font-medium text-slate-500'>
              {visibleItems.length} {selectedCategory ? 'matching' : 'items available'}
            </p>
          </div>
        </div>
        <div className='grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {visibleItems.map((item, index) => (
            <GroceryItemCard item={item} key={item._id?.toString() || `${item.name}-${index}`} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default UserDashboard
