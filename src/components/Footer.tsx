'use client'

import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react"
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6"
import { motion, type Variants } from "motion/react"
import { useSession } from "next-auth/react"
import Link from "next/link"

const Footer = () => {
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated" && !!session?.user
  const role = session?.user?.role as "user" | "admin" | "deliveryMan" | undefined

  const primaryCta = !isAuthenticated
    ? { href: "/login", label: "Login" }
    : role === "admin"
    ? { href: "/", label: "Go to Dashboard" }
    : role === "deliveryMan"
    ? { href: "/", label: "Go to Dashboard" }
    : { href: "/", label: "Shop Now" }

  const secondaryCta = !isAuthenticated
    ? { href: "/register", label: "Register" }
    : role === "admin"
    ? { href: "/admin/manage-orders", label: "Manage Orders" }
    : role === "deliveryMan"
    ? { href: "/products", label: "View Products" }
    : { href: "/user/cart", label: "View Cart" }

  const quickLinks = !isAuthenticated
    ? [
        { href: "/products", label: "All Products" },
        { href: "/register", label: "Register" },
        { href: "/login", label: "Login" },
      ]
    : role === "admin"
    ? [
        { href: "/admin/add-grocery", label: "Add Grocery" },
        { href: "/admin/view-grocery", label: "View Grocery" },
        { href: "/admin/manage-orders", label: "Manage Orders" },
      ]
    : role === "deliveryMan"
    ? [
        { href: "/", label: "Dashboard" },
        { href: "/products", label: "All Products" },
      ]
    : [
        { href: "/user/cart", label: "View Cart" },
        { href: "/user/my-order", label: "My Orders" },
        { href: "/user/my-order", label: "Track Order" },
      ]

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.08 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0 },
  }

  const socialLinks = [
    { href: "https://facebook.com", icon: FaFacebookF, label: "Facebook" },
    { href: "https://instagram.com", icon: FaInstagram, label: "Instagram" },
    { href: "https://twitter.com", icon: FaXTwitter, label: "Twitter" },
    { href: "https://linkedin.com", icon: FaLinkedinIn, label: "LinkedIn" },
  ]

  return (
    <motion.footer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-16 border-t border-blue-100 bg-linear-to-b from-blue-950 via-blue-900 to-slate-950 text-white"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.9fr]">
          <motion.div variants={itemVariants} className="space-y-5">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-blue-100 shadow-inner">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-700 shadow-md shadow-black/20">
                GC
              </span>
              Grocery Cart
            </div>
            <p className="max-w-md text-sm leading-7 text-blue-100/80 sm:text-base">
              Fresh groceries, simple checkout, and friendly delivery updates in one place. Built for everyday shopping and smoother operations.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-blue-900 shadow-lg shadow-black/15 transition-all hover:-translate-y-0.5 hover:bg-blue-50"
              >
                {primaryCta.label}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                {secondaryCta.label}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-5">
            <h2 className="text-lg font-extrabold tracking-normal text-white">Quick Links</h2>
            <ul className="space-y-3 text-sm text-blue-100/80">
              <li>
                <Link href="/" className="inline-flex items-center gap-2 transition-colors hover:text-white">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  Home
                </Link>
              </li>
              {quickLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link href={link.href} className="inline-flex items-center gap-2 transition-colors hover:text-white">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-5">
            <h2 className="text-lg font-extrabold tracking-normal text-white">Contact Us</h2>
            <ul className="space-y-3 text-sm text-blue-100/80">
              <li className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-blue-300" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-blue-300" />
                <span>+8801122334455</span>
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-blue-300" />
                <span>grocerycart@gcr.com</span>
              </li>
            </ul>

            <div className="flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -3, scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 420, damping: 22 }}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-blue-100 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label={item.label}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 text-sm text-blue-100/70 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Grocery Cart. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/" className="transition-colors hover:text-white">Privacy</Link>
              <Link href="/" className="transition-colors hover:text-white">Terms</Link>
              <Link href="/" className="transition-colors hover:text-white">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
