"use client"

import { motion } from "framer-motion"

const ProposalDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header with Image */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-64 sm:h-80 bg-gray-200 animate-pulse"></div>
              <div className="p-6 space-y-4">
                <div className="h-8 bg-gray-200 rounded-md animate-pulse w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded-md animate-pulse w-2/3"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse mr-2 mt-0.5"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 pb-3">
                <div className="h-6 bg-gray-200 rounded-md animate-pulse w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-md animate-pulse w-2/3"></div>
              </div>
              <div className="h-[400px] bg-gray-200 animate-pulse"></div>
            </div>

            {/* Eligibility Criteria */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded-md animate-pulse w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse mr-2 mt-0.5"></div>
                      <div className="h-4 bg-gray-200 rounded-md animate-pulse flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Voting & Stats */}
          <div className="space-y-8">
            {/* Voting Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="h-6 bg-gray-200 rounded-md animate-pulse w-1/2"></div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/4"></div>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full animate-pulse"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="h-8 bg-gray-200 rounded-md animate-pulse w-1/2 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/3 mx-auto mt-2"></div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="h-8 bg-gray-200 rounded-md animate-pulse w-1/2 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/3 mx-auto mt-2"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/4"></div>
                  </div>
                  <div className="h-2.5 bg-gray-200 rounded-full animate-pulse"></div>
                </div>

                <div className="flex gap-3">
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse flex-1"></div>
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse flex-1"></div>
                </div>
              </div>
            </div>

            {/* Recent Voters */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded-md animate-pulse w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/4"></div>
                </div>

                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProposalDetailsSkeleton
