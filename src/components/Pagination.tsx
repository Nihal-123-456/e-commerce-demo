'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className='mt-10 flex flex-wrap items-center justify-center gap-2'>
      <button
        type='button'
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className='flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700 shadow-sm transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40'
        aria-label='Previous page'
      >
        <ChevronLeft className='h-5 w-5' />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type='button'
          onClick={() => onPageChange(page)}
          className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition-colors ${
            page === currentPage
              ? 'bg-blue-600 text-white shadow-md shadow-blue-300/60'
              : 'border border-blue-100 bg-white text-slate-600 hover:bg-blue-50'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type='button'
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className='flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700 shadow-sm transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40'
        aria-label='Next page'
      >
        <ChevronRight className='h-5 w-5' />
      </button>
    </div>
  )
}

export default Pagination
