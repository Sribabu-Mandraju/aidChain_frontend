"use client"

import { useState, useEffect } from "react"
import ChatButton from "./ChatButton"
import ChatWindow from "./ChatWindow"

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleSendMessage = async (text) => {
    // Add user message to chat
    const userMessage = {
      text,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("https://disaster-assistant.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: text,
          lang_code: selectedLanguage,
        }),
      })

      const data = await response.json()

      // Add bot response to chat
      const botMessage = {
        text: data.response || "Sorry, I couldn't process your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      // Add error message
      const errorMessage = {
        text: "Sorry, there was an error connecting to the service. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode)
  }

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const chatWindow = document.getElementById("chat-window")
      const chatButton = document.getElementById("chat-button")

      if (
        isOpen &&
        chatWindow &&
        !chatWindow.contains(event.target) &&
        chatButton &&
        !chatButton.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <>
      <div id="chat-button">
        <ChatButton onClick={toggleChat} isOpen={isOpen} />
      </div>
      <div id="chat-window">
        <ChatWindow
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </div>
    </>
  )
}

export default ChatBot
