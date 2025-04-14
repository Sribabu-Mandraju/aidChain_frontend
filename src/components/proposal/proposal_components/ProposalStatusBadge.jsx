"use client"

import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"

const ProposalStatusBadge = ({ state }) => {
  let bgColor = "bg-gray-500"
  const textColor = "text-white"
  let icon = <Clock className="w-4 h-4 mr-1" />
  const label = state

  switch (state) {
    case "Active":
      bgColor = "bg-blue-500"
      icon = <Clock className="w-4 h-4 mr-1" />
      break
    case "Urgent":
      bgColor = "bg-red-500"
      icon = <AlertCircle className="w-4 h-4 mr-1" />
      break
    case "Approved":
      bgColor = "bg-green-500"
      icon = <CheckCircle className="w-4 h-4 mr-1" />
      break
    case "Rejected":
      bgColor = "bg-red-500"
      icon = <XCircle className="w-4 h-4 mr-1" />
      break
    case "Completed":
      bgColor = "bg-gray-500"
      icon = <CheckCircle className="w-4 h-4 mr-1" />
      break
    default:
      break
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${bgColor} ${textColor}`}>
      {icon}
      {label}
    </span>
  )
}

export default ProposalStatusBadge
