'use client'

import { useMemo, useState } from 'react'
import { motion, type Variants } from 'motion/react'
import { Package, Truck, Users, Wallet, ChevronRight } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type propType = {
  earning: {
    today: number,
    sevenDays: number,
    total: number
  },
  stats: {
    title: string,
    value: number
  }[],
  chartData: {
    day: string;
    orders: number;
  }[]
}

type FilterKey = "today" | "sevenDays" | "total"

const AdminDashboardClient = ({earning, stats, chartData}: propType) => {
  const [filter, setFilter] = useState<FilterKey>("total")

  const currentEarning = filter === "today" ? earning.today : filter === "sevenDays" ? earning.sevenDays : earning.total
  const title = filter === "today" ? "Today's Earning" : filter === "sevenDays" ? "Last Seven Day's Earning" : "Total Earning"

  const icons = useMemo(() => ([
    Package,
    Users,
    Truck,
    Wallet,
  ]), [])

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
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

  const filters: { key: FilterKey; label: string }[] = [
    { key: "total", label: "Total" },
    { key: "sevenDays", label: "Last 7 days" },
    { key: "today", label: "Today" },
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-blue-50/70 to-white px-4 py-30 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-7xl"
      >
        <motion.div
          variants={cardVariants}
          className="mb-8 rounded-3xl border border-blue-100 bg-white px-6 py-6 shadow-lg shadow-blue-100/60 sm:px-8"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Admin overview</p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-900 sm:text-4xl">Admin Dashboard</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Track earnings, order volume, and operational stats from one place.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Earning range</p>
              <div className="inline-flex flex-wrap gap-2 rounded-2xl bg-blue-50/70 p-2">
                {filters.map((item) => {
                  const active = filter === item.key
                  return (
                    <motion.button
                      key={item.key}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 420, damping: 22 }}
                      type="button"
                      onClick={() => setFilter(item.key)}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                        active
                          ? "bg-blue-600 text-white shadow-md shadow-blue-300/60"
                          : "bg-white text-blue-700 hover:bg-blue-50"
                      }`}
                    >
                      {item.label}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="space-y-6">
            <motion.div
              variants={cardVariants}
              className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/60 sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">{title}</p>
                  <p className="mt-2 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                    Tk {currentEarning.toLocaleString()}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  <ChevronRight className="h-4 w-4" />
                  Revenue snapshot
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid gap-4 sm:grid-cols-2"
            >
              {stats.map((s, index) => {
                const Icon = icons[index] ?? Package
                return (
                  <motion.div
                    key={s.title}
                    variants={cardVariants}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 320, damping: 24 }}
                    className="rounded-3xl border border-blue-100 bg-white p-5 shadow-md shadow-blue-100/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">{s.title}</p>
                        <p className="mt-2 text-3xl font-black text-slate-900">{s.value}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          <motion.div
            variants={cardVariants}
            className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg shadow-blue-100/60"
          >
            <div className="border-b border-blue-100/80 px-6 py-5 sm:px-7">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Orders overview</p>
              <h2 className="mt-2 text-2xl font-black tracking-normal text-slate-900">Last 7 Days</h2>
              <p className="mt-2 text-sm text-slate-500">
                Daily order volume with a clean blue chart treatment.
              </p>
            </div>

            <div className="h-90 p-4 sm:h-105 sm:p-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={28} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#dbeafe" strokeDasharray="4 4" vertical={false} />
                  <XAxis
                    dataKey="day"
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
                  <Bar
                    dataKey="orders"
                    fill="#2563eb"
                    radius={[10, 10, 0, 0]}
                    activeBar={{ fill: '#1d4ed8' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminDashboardClient
