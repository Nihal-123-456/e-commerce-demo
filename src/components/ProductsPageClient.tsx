'use client'

import React, { useMemo, useState } from 'react'
import CategorySlider from './CategorySlider'
import GroceryItemCard from './GroceryItemCard'
import Pagination from './Pagination'
import { IGrocery } from '@/models/grocery.model'

const PAGE_SIZE = 12

type ProductsPageClientProps = {
  groceryList: IGrocery[]
  role?: 'user' | 'admin' | 'deliveryMan'
}

const ProductsPageClient = ({ groceryList, role }: ProductsPageClientProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

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

  const totalPages = Math.max(1, Math.ceil(visibleItems.length / PAGE_SIZE))

  const paginatedItems = useMemo(
    () => visibleItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [visibleItems, currentPage]
  )

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleShowAll = () => {
    setSelectedCategory(null)
    setCurrentPage(1)
  }

  return (
    <main className='min-h-screen bg-linear-to-b from-slate-50 via-blue-50/60 to-white px-4 pb-16 pt-30 sm:px-6 lg:px-8'>
      <div className='mx-auto w-full max-w-7xl'>
        <p className='text-sm font-semibold uppercase tracking-[0.18em] text-blue-600'>Catalog</p>
        <h1 className='mt-1 text-3xl font-black text-slate-900 sm:text-4xl'>All Products</h1>
      </div>

      <CategorySlider
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      <section className='mx-auto w-full max-w-7xl'>
        <div className='mb-6 flex flex-wrap items-end justify-between gap-4'>
          <div>
            {selectedCategory ? (
              <p className='text-sm font-semibold uppercase tracking-[0.18em] text-blue-600'>Filtered by {selectedCategory}</p>
            ) : null}
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            {selectedCategory ? (
              <button
                type='button'
                onClick={handleShowAll}
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
          {paginatedItems.map((item, index) => (
            <GroceryItemCard item={item} role={role} key={item._id?.toString() || `${item.name}-${index}`} />
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </section>
    </main>
  )
}

export default ProductsPageClient
