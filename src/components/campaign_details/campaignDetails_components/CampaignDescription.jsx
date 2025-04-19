"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, AlertTriangle, FileText, Link, ExternalLink } from "lucide-react"

const CampaignDescription = ({ campaign }) => {
  const [expanded, setExpanded] = useState(false)

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{campaign.title}</h2>

        {/* <div className={`prose prose-green max-w-none ${!expanded && "line-clamp-6"}`}>
          <p>{campaign.description}</p>
        </div> */}

        {campaign.description && campaign.description.length > 300 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 text-green-600 hover:text-green-700 font-medium"
          >
            {expanded ? (
              <>
                <ChevronUp size={16} />
                <span>Show less</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                <span>Read more</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Campaign Details */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Created By */}
          {/* <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Created By</div>
              <div className="text-sm text-gray-500">{campaign.createdBy || "Anonymous"}</div>
            </div>
          </div> */}

          {/* Created On */}
          {/* <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Created On</div>
              <div className="text-sm text-gray-500">{formatDate(campaign.createdAt)}</div>
            </div>
          </div> */}

          {/* Contract Address */}
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Link size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Contract Address</div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <span className="truncate max-w-[200px]">{campaign.contractAddress}</span>
                <a
                  href={`https://sepolia.basescan.org/address/${campaign.contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Campaign ID */}
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">Campaign ID</div>
              <div className="text-sm text-gray-500">{campaign.id}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <AlertTriangle size={20} className="text-amber-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-800">Disclaimer</h4>
            <p className="text-sm text-amber-700 mt-1">
              This campaign is managed through a smart contract on the Base Sepolia blockchain. All donations are held
              in escrow and distributed to verified victims. Please verify the campaign details before donating.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDescription
