'use client'

import Link from 'next/link'
import { ArrowRight, BadgeCheck, Leaf, PackageCheck, ShieldCheck, ShoppingBasket, Sparkles, Truck } from 'lucide-react'
import { motion, type Variants } from 'motion/react'
import { useSession } from 'next-auth/react'

const LandingPage = () => {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated' && !!session?.user
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.08 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  const features = [
    {
      icon: ShoppingBasket,
      title: 'Fresh essentials',
      text: 'Discover daily groceries, produce, pantry staples, and household favorites in one smooth shopping flow.',
    },
    {
      icon: Truck,
      title: 'Fast delivery',
      text: 'Track your order live and get dependable doorstep updates from checkout to arrival.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure checkout',
      text: 'Enjoy a trustworthy experience with simple account access and clear order visibility.',
    },
  ]

  const steps = [
    { title: 'Create an account', text: 'Register in seconds and save your delivery preferences.' },
    { title: 'Pick your groceries', text: 'Browse fresh categories and add everything you need to your cart.' },
    { title: 'Track your order', text: 'Follow live updates and get notified the moment your delivery arrives.' },
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-blue-50/70 to-white text-slate-900">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-black tracking-wide text-blue-800">
          GroceryCart
        </Link>
        {!isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm shadow-blue-100 transition-colors hover:bg-blue-50"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-300/60 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        ) : (
          <Link
            href="/"
            className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm shadow-blue-100 transition-colors hover:bg-blue-50"
          >
            Open app
          </Link>
        )}
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-8 rounded-4xl border border-blue-100 bg-white/80 p-6 shadow-[0_20px_60px_-20px_rgba(37,99,235,0.25)] backdrop-blur sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10"
        >
          <div className="max-w-2xl">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              <Sparkles className="h-4 w-4" />
              Fresh groceries, delivered with ease
            </motion.div>

            <motion.h1 variants={itemVariants} className="mt-5 text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Your everyday grocery run, made simple.
            </motion.h1>

            <motion.p variants={itemVariants} className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Shop from a curated selection of daily essentials, track every order in real time, and enjoy a smoother way to keep your home stocked.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-3 sm:flex-row">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-300/60 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-full border border-blue-100 bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-sm shadow-blue-100 transition-colors hover:bg-blue-50"
                  >
                    Already a member?
                  </Link>
                </>
              ) : (
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-300/60 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Go to your dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2">
                <BadgeCheck className="h-4 w-4 text-blue-600" />
                Fast checkout
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2">
                <Leaf className="h-4 w-4 text-emerald-600" />
                Fresh picks
              </span>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="relative">
            <div className="rounded-4xl border border-blue-100 bg-linear-to-br from-blue-600 via-blue-700 to-slate-900 p-6 text-white shadow-2xl shadow-blue-200/70 sm:p-8">
              <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                <div>
                  <p className="text-sm font-semibold text-blue-100">Today’s essentials</p>
                  <p className="mt-1 text-xl font-black">Fresh, fast, and reliable</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                  <PackageCheck className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-sm font-semibold text-white">Live tracking</p>
                  <p className="mt-1 text-sm text-blue-100">Follow every step of your delivery from dispatch to doorstep.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-sm font-semibold text-white">Smart categories</p>
                  <p className="mt-1 text-sm text-blue-100">Shop by everyday categories and find staples in minutes.</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.45 }}
              className="absolute -bottom-10 -left-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-lg shadow-blue-100/80"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Popular today</p>
              <p className="mt-1 text-lg font-extrabold text-slate-900">Free delivery over Tk 500</p>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="grid gap-5 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                className="rounded-3xl border border-blue-100 bg-white p-6 shadow-md shadow-blue-100/70"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{feature.text}</p>
                <div className="mt-4 text-sm font-semibold text-blue-700">0{index + 1}</div>
              </motion.div>
            )
          })}
        </motion.section>

        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="rounded-4xl border border-blue-100 bg-linear-to-br from-blue-50 via-white to-slate-50 p-6 shadow-lg shadow-blue-100/70 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">How it works</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">A simple 3-step experience from cart to doorstep.</h2>
            </div>
            {!isAuthenticated ? (
              <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700">
                Create your account
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700">
                Open the app
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div key={step.title} variants={itemVariants} className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-sm font-black text-blue-700">
                  0{index + 1}
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="rounded-4xl border border-blue-100 bg-slate-900 p-8 text-white shadow-2xl shadow-blue-200/60 sm:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Ready to shop?</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">Start building your basket today.</h2>
            </div>
            {!isAuthenticated ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-blue-50">
                  Sign up now
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20">
                  I already have an account
                </Link>
              </div>
            ) : (
              <Link href="/" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-blue-50">
                Open the app
              </Link>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  )
}

export default LandingPage
