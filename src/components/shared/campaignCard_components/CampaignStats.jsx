import { Coins, Info } from "lucide-react"

const CampaignStats = ({ campaign }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-green-50 rounded-xl p-3 border border-green-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 mb-1">Per Victim</div>
            <div className="text-lg font-bold text-gray-800">
              {campaign.amountPerVictim} <span className="text-sm font-normal text-gray-600">USDC</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <Coins size={20} className="text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 mb-1">Campaign ID</div>
            <div className="text-sm font-medium text-gray-800 truncate" title={campaign.id}>
              {campaign.id ? campaign.id.substring(0, 8) + "..." : "N/A"}
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Info size={20} className="text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignStats 