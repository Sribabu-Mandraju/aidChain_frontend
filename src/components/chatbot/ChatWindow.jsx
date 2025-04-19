"use client"

import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import InputArea from "./InputArea"

const ChatWindow = ({ isOpen, onClose, messages, onSendMessage, isLoading, selectedLanguage, onLanguageChange }) => {
  return (
    <div
      className={`fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 transition-all duration-300 overflow-hidden ${
        isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
      }`}
      style={{
        transformOrigin: "bottom right",
        boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.2), 0 10px 10px -5px rgba(16, 185, 129, 0.1)",
      }}
    >
      {/* Animated Background Elements */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full opacity-30">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div> */}

      <ChatHeader onClose={onClose} selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange} />
      <MessageList messages={messages} />
      <InputArea onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  )
}

export default ChatWindow
