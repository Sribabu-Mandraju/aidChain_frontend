"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import RichTextEditor from "./newProposal_components/RichTextEditor"
import FormField from "./newProposal_components/FormField"
import ImageUploadField from "./newProposal_components/ImageUploadField"
import ProposalPreview from "./newProposal_components/ProposalPreview"
import { validateProposalForm } from "../../utils/newProposal_validation"
import { useNavigate } from "react-router-dom"

const NewProposal = () => {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(1)
  const [formData, setFormData] = useState({
    disasterName: "",
    area: "",
    duration: 30,
    fundsRequested: 100000,
    description: "",
    image: "https://images.unsplash.com/photo-1542393545-10f5b85e14fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const handleEditorChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      description: content,
    }))

    if (errors.description) {
      setErrors((prev) => ({
        ...prev,
        description: null,
      }))
    }
  }

  const handleImageChange = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
    }))
  }

  const nextStep = () => {
    const stepErrors = validateProposalForm(formData, activeStep)

    if (Object.keys(stepErrors).length === 0) {
      setActiveStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    } else {
      setErrors(stepErrors)
    }
  }

  const prevStep = () => {
    setActiveStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formErrors = validateProposalForm(formData, activeStep)

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true)

      try {
        // In a real app, this would be a call to your blockchain contract
        console.log("Submitting proposal:", formData)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Redirect to DAO page after successful submission
        navigate("/dao")
      } catch (error) {
        console.error("Error submitting proposal:", error)
        alert("Failed to submit proposal. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setErrors(formErrors)
    }
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <FormField
              label="Disaster Name"
              name="disasterName"
              value={formData.disasterName}
              onChange={handleChange}
              error={errors.disasterName}
              placeholder="e.g., Hurricane Relief Fund"
            />

            <FormField
              label="Affected Area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              error={errors.area}
              placeholder="e.g., Caribbean Islands"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Duration (days)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                error={errors.duration}
                min={1}
              />

              <FormField
                label="Funds Requested (USD)"
                name="fundsRequested"
                type="number"
                value={formData.fundsRequested}
                onChange={handleChange}
                error={errors.fundsRequested}
                min={1}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Proposal Description</label>
              <RichTextEditor value={formData.description} onChange={handleEditorChange} error={errors.description} />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <ImageUploadField value={formData.image} onChange={handleImageChange} label="Campaign Image" />
          </div>
        )

      case 3:
        return <ProposalPreview proposal={formData} />

      default:
        return null
    }
  }

  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-br from-white to-green-50 min-h-screen">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dao")}
            className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to DAO
          </button>
        </div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-1.5 bg-green-100 rounded-full mb-4">
            <span className="animate-pulse w-2 h-2 bg-green-600 rounded-full mr-2"></span>
            <span className="text-green-800 font-medium text-sm">New Proposal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Create a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
              Relief Proposal
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Submit your proposal to the DAO for consideration. Provide detailed information to help members make
            informed decisions.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    activeStep >= step
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                <span className="mt-2 text-xs text-gray-500">
                  {step === 1 ? "Basic Info" : step === 2 ? "Details" : "Review"}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded"></div>
            <div
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded transition-all duration-300"
              style={{ width: `${((activeStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Container */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            <div className="mt-8 flex justify-between">
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}

              {activeStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting && (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  Submit Proposal
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

export default NewProposal
