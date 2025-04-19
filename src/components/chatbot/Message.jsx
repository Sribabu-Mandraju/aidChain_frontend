const Message = ({ text, isUser, timestamp }) => {
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 shadow-md ${
          isUser
            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-tr-none"
            : "bg-white border border-green-100 text-gray-600 rounded-tl-none"
        }`}
      >
        <div className="text-sm">{text}</div>
        <div className={`text-xs mt-1 text-right ${isUser ? "text-green-100" : "text-gray-500"}`}>{formattedTime}</div>
      </div>
    </div>
  )
}

export default Message
