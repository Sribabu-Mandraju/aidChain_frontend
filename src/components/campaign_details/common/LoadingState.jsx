import { Loader2 } from "lucide-react"

const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <Loader2 size={48} className="animate-spin text-green-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{message}</h2>
        <p className="text-gray-500 max-w-md mx-auto">Please wait while we fetch the campaign information.</p>
      </div>
    </div>
  )
}

export default LoadingState
