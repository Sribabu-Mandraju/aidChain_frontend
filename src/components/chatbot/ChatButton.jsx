"use client"

import { MessageCircle } from "lucide-react"

const ChatButton = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
        isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
      } bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-2xl hover:scale-105 text-white z-50 group`}
      aria-label="Open chat"
    >
      <MessageCircle size={28} />
      <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
      <span className="absolute w-full h-full rounded-full animate-ping bg-green-400 opacity-30"></span>
    </button>
  )
}

export default ChatButton
