"use client"

import { useState } from "react"
import { Search, ExternalLink, DollarSign } from "lucide-react"

const CampaignDonors = ({ donors }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  // Format address
  const formatAddress = (address) => {
    if (!address) return "Unknown"
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A"
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Filter and sort donors
  const filteredDonors = donors
    .filter(
      (donor) =>
        donor.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (donor.amount && donor.amount.toString().includes(searchTerm)),
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" ? a.timestamp - b.timestamp : b.timestamp - a.timestamp
      } else if (sortBy === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
      }
      return 0
    })

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Donors</h2>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search donors..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <button
            onClick={() => handleSortChange("date")}
            className={`px-3 py-1 text-sm rounded-lg ${
              sortBy === "date" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSortChange("amount")}
            className={`px-3 py-1 text-sm rounded-lg ${
              sortBy === "amount" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Amount {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      {/* Donors List */}
      {filteredDonors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No donors found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Donor Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount (USDC)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Transaction
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonors.map((donor, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <DollarSign size={16} className="text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{formatAddress(donor.address)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{donor.amount} USDC</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(donor.timestamp)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donor.txHash ? (
                      <a
                        href={`https://sepolia.basescan.org/tx/${donor.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        View <ExternalLink size={14} />
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CampaignDonors
