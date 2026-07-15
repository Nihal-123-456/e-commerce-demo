'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import mongoose from 'mongoose'
import { Send, MessageSquareText } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { getSocket } from '@/lib/socket'
import { IMessage } from '@/models/message.model'
import axios from 'axios'

type props = {
    orderId: mongoose.Types.ObjectId,
    senderId: mongoose.Types.ObjectId | undefined
}

const DeliveryChat = ({orderId, senderId}:props) => {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<IMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(()=>{
    const socket = getSocket()
    socket.emit("join-room", orderId)

    const handleIncomingMessage = (message: IMessage) => {
      if (String(message.roomId) !== String(orderId)) return
      setMessages((prev) => [...prev, message])
    }

    socket.on("send-message", handleIncomingMessage)
    return () => {
      socket.off("send-message", handleIncomingMessage)
    }
  }, [orderId])

  const sendMessage = () => {
    if(!newMessage.trim()) return
    const socket = getSocket()
    const message = {
        roomId: orderId,
        text: newMessage,
        senderId: senderId,
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    }
    socket.emit("send-message", message)
    setNewMessage("")
  }

  useEffect(()=>{
    const getAllMessages = async() => {
        try {
            const result = await axios.post("/api/chat/messages", {roomId: orderId})
            setMessages(result.data ?? [])
        } catch (error) {
            console.log(error);
        }
    }
    getAllMessages()
  }, [orderId])

  const messageCountText = useMemo(() => {
    if (messages.length === 0) return "No messages yet"
    return `${messages.length} message${messages.length === 1 ? "" : "s"}`
  }, [messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="border-t border-blue-100 bg-blue-50/35 px-4 py-4 sm:px-5"
    >
      <div className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm shadow-blue-100/50 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Delivery chat</p>
              <p className="text-xs text-slate-500">Send quick updates for this order</p>
            </div>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {messageCountText}
          </span>
        </div>

        <div className="max-h-72 space-y-3 overflow-y-auto pr-1 sm:max-h-80">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              const isDeliveryMan = String(message.senderId) === String(senderId)
              return (
                <motion.div
                  key={message._id?.toString() ?? `${message.time}-${index}`}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`flex ${isDeliveryMan ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl px-4 py-3 shadow-sm sm:max-w-[75%] ${
                      isDeliveryMan
                        ? "rounded-br-md bg-blue-600 text-white shadow-blue-300/60"
                        : "rounded-bl-md border border-blue-100 bg-white text-slate-800 shadow-blue-100/50"
                    }`}
                  >
                    <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6">{message.text}</p>
                    <div className={`mt-2 text-[11px] font-medium ${isDeliveryMan ? "text-blue-50/90" : "text-slate-400"}`}>
                      {message.time}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {messages.length === 0 && (
            <div className="rounded-3xl border border-dashed border-blue-100 bg-blue-50/40 px-4 py-8 text-center text-sm text-slate-500">
              No messages yet. Send the first update below.
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Type a message..."
            onChange={(e)=>setNewMessage(e.target.value)}
            value={newMessage}
            className="w-full rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            onClick={sendMessage}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-md shadow-blue-300/60 transition-colors hover:bg-blue-700 sm:w-auto"
          >
            <Send size={18}/>
            Send
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default DeliveryChat
