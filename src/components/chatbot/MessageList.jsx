"use client"

import { useRef, useEffect } from "react"
import Message from "./Message"

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-white to-green-50">
      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #10b981 1px, transparent 1px),
            linear-gradient(to bottom, #10b981 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      ></div>

      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-600 relative z-10">
          <div className="w-16 h-16 mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-600 text-2xl">👋</span>
          </div>
          <p className="text-center font-semibold">Welcome to KarunyaSetu</p>
          <p className="text-center text-sm mt-2">How can I help you today?</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <Message key={index} text={message.text} isUser={message.isUser} timestamp={message.timestamp} />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList
