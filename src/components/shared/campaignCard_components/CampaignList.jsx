import CampaignCard from "../CampaignCard"
const CampaignList = ({ campaigns }) => {
  return (
    <div className="container w-full mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Active Campaigns</h2>
      <div className="grid grid-cols-1 gap-8">
        {campaigns.map((campaign, index) => (
          <CampaignCard key={campaign.id} campaign={campaign} index={index} />
        ))}
      </div>
    </div>
  )
}

export default CampaignList
