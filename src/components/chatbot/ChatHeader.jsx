"use client"
import { X } from "lucide-react"

const ChatHeader = ({ onClose, selectedLanguage, onLanguageChange }) => {
  const languages = {
    hi: "Hindi",
    te: "Telugu",
    ta: "Tamil",
    bn: "Bengali",
    mr: "Marathi",
    ml: "Malayalam",
    kn: "Kannada",
    en: "English",
  }

  return (
    <div className="bg-green-700 text-white p-4 rounded-t-lg flex justify-between items-center">
      <div className="flex items-center">
        <div className="mr-2 bg-white rounded-full p-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-400 flex items-center justify-center">
            <span className="text-white font-bold">K</span>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg">KarunyaSetu</h3>
          <p className="text-xs text-green-100">Disaster Assistant</p>
        </div>
      </div>

      <div className="flex items-center">
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="mr-3 text-sm bg-green-700 text-white border border-green-400 rounded px-2 py-1"
        >
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>

        <button
          onClick={onClose}
          className="text-white hover:bg-green-700 rounded-full p-1 transition-colors"
          aria-label="Close chat"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader
