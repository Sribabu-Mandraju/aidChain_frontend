import { CheckCircle, Clock, AlertCircle } from "lucide-react"

const CampaignTimeline = ({ campaign, currentState, timeLeft }) => {
  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format time left
  const formatTimeLeft = (seconds) => {
    if (seconds <= 0) return "Ended"

    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)

    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
  }

  // Timeline steps
  const timelineSteps = [
    {
      id: 0,
      name: "Donation Period",
      description: "Donors can contribute USDC to the campaign",
      date: formatDate(campaign.donationStartDate),
      endDate: formatDate(campaign.donationEndDate),
      timeLeft: currentState === 0 ? formatTimeLeft(timeLeft.donation) : null,
      status: currentState > 0 ? "complete" : currentState === 0 ? "current" : "upcoming",
    },
    {
      id: 1,
      name: "Registration Period",
      description: "Affected victims can register for aid",
      date: formatDate(campaign.registrationStartDate),
      endDate: formatDate(campaign.registrationEndDate),
      timeLeft: currentState === 1 ? formatTimeLeft(timeLeft.registration) : null,
      status: currentState > 1 ? "complete" : currentState === 1 ? "current" : "upcoming",
    },
    {
      id: 2,
      name: "Waiting Period",
      description: "Verification of victim claims",
      date: formatDate(campaign.waitingStartDate),
      endDate: formatDate(campaign.waitingEndDate),
      timeLeft: currentState === 2 ? formatTimeLeft(timeLeft.waiting) : null,
      status: currentState > 2 ? "complete" : currentState === 2 ? "current" : "upcoming",
    },
    {
      id: 3,
      name: "Distribution Period",
      description: "Funds are distributed to verified victims",
      date: formatDate(campaign.distributionStartDate),
      endDate: formatDate(campaign.distributionEndDate),
      timeLeft: currentState === 3 ? formatTimeLeft(timeLeft.distribution) : null,
      status: currentState > 3 ? "complete" : currentState === 3 ? "current" : "upcoming",
    },
    {
      id: 4,
      name: "Campaign Ended",
      description: "All funds have been distributed",
      date: formatDate(campaign.endDate),
      status: currentState === 4 ? "current" : currentState < 4 ? "upcoming" : "complete",
    },
  ]

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Campaign Timeline</h2>

        <div className="flow-root">
          <ul className="-mb-8">
            {timelineSteps.map((step, stepIdx) => (
              <li key={step.id}>
                <div className="relative pb-8">
                  {stepIdx !== timelineSteps.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                          step.status === "complete"
                            ? "bg-green-500"
                            : step.status === "current"
                              ? "bg-blue-500"
                              : "bg-gray-300"
                        }`}
                      >
                        {step.status === "complete" ? (
                          <CheckCircle size={16} className="text-white" />
                        ) : step.status === "current" ? (
                          <Clock size={16} className="text-white" />
                        ) : (
                          <AlertCircle size={16} className="text-white" />
                        )}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5">
                      <div className="flex justify-between">
                        <p
                          className={`text-sm font-medium ${
                            step.status === "complete"
                              ? "text-green-600"
                              : step.status === "current"
                                ? "text-blue-600"
                                : "text-gray-500"
                          }`}
                        >
                          {step.name}
                        </p>
                        <p className="text-right text-sm text-gray-500">
                          {step.date} {step.endDate && `- ${step.endDate}`}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">{step.description}</p>

                      {step.timeLeft && (
                        <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Clock size={12} className="mr-1" />
                          {step.timeLeft}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CampaignTimeline
