import { FileText, Download, ExternalLink, AlertTriangle } from "lucide-react"

const CampaignDocuments = ({ campaign }) => {
  // Sample documents (in a real app, these would come from the campaign data)
  const documents = campaign.documents || [
    {
      id: 1,
      name: "Disaster Assessment Report",
      type: "PDF",
      size: "2.4 MB",
      url: "#",
      date: "2023-09-15",
    },
    {
      id: 2,
      name: "Relief Distribution Plan",
      type: "PDF",
      size: "1.8 MB",
      url: "#",
      date: "2023-09-18",
    },
    {
      id: 3,
      name: "Victim Registration Guidelines",
      type: "PDF",
      size: "1.2 MB",
      url: "#",
      date: "2023-09-20",
    },
  ]

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Documents</h2>

      {documents.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <p className="text-gray-500">No documents available for this campaign.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{doc.name}</h3>
                  <p className="text-xs text-gray-500">
                    {doc.type} • {doc.size} • Added on {formatDate(doc.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={doc.url}
                  download
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="Download"
                >
                  <Download size={18} />
                </a>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  title="View"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verification Note */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <AlertTriangle size={20} className="text-amber-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-800">Document Verification</h4>
            <p className="text-sm text-amber-700 mt-1">
              All documents are verified by campaign administrators. Please review these documents carefully before
              making donations or registering as a victim.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDocuments
