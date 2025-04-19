"use client"

import { useState } from "react"
import { Calendar, ChevronDown, ChevronUp } from "lucide-react"

const CampaignUpdates = ({ updates }) => {
  const [expandedUpdate, setExpandedUpdate] = useState(null)

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Toggle update expansion
  const toggleUpdate = (id) => {
    if (expandedUpdate === id) {
      setExpandedUpdate(null)
    } else {
      setExpandedUpdate(id)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Updates</h2>

      {updates.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <p className="text-gray-500">No updates available for this campaign yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map((update, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => toggleUpdate(index)}>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Calendar size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{update.title}</h3>
                    <p className="text-sm text-gray-500">{formatDate(update.timestamp)}</p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  {expandedUpdate === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {expandedUpdate === index && (
                <div className="px-6 pb-4 pt-2">
                  <div className="prose prose-sm max-w-none">
                    <p>{update.content}</p>
                  </div>

                  {update.author && <p className="mt-4 text-sm text-gray-500">Posted by: {update.author}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CampaignUpdates
