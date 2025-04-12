"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import StepWizard from "react-step-wizard"
import Step1BasicInfo from "./addProposal_components/Step1BasicInfo"
import Step2Location from "./addProposal_components/Step2Location"
import Step3ImageUpload from "./addProposal_components/Step3ImageUpload"
import Step4Review from "./addProposal_components/Step4Review"

const ProposalForm = () => {
  const [formData, setFormData] = useState({
    disasterName: "",
    fundsRequested: "",
    startTime: "",
    endTime: "",
    location: {
      latitude: "",
      longitude: "",
      radius: "",
    },
    image: "",
  })

  const updateFormData = (newData) => {
    console.log("ProposalForm: Updating formData", newData)
    setFormData((prev) => ({ ...prev, ...newData }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create a New Proposal</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Fill out the form below to create a new disaster relief proposal. All fields are required to ensure your
            proposal can be properly evaluated.
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <StepWizard isLazyMount={true}>
            <Step1BasicInfo formData={formData} updateFormData={updateFormData} />
            <Step2Location formData={formData} updateFormData={updateFormData} />
            <Step3ImageUpload formData={formData} updateFormData={updateFormData} />
            <Step4Review formData={formData} />
          </StepWizard>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Need help? Contact our support team at support@example.com
        </div>
      </div>
    </div>
  )
}

export default ProposalForm