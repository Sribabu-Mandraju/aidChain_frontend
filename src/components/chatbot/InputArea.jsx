"use client"

import { useState } from "react"
import { Send } from "lucide-react"

const InputArea = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-green-100 p-3 bg-white rounded-b-lg">
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-green-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-600"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`ml-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full p-2.5 shadow-md transition-all duration-300 ${
            isLoading || !message.trim() ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:scale-105"
          }`}
          disabled={isLoading || !message.trim()}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </form>
  )
}

export default InputArea
