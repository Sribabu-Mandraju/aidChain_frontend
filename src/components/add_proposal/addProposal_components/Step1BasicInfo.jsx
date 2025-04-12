"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import FormNavigation from "./FormNavigation"
import { Calendar, DollarSign, AlertCircle } from "lucide-react"

const Step1BasicInfo = (props) => {
  const { formData, updateFormData, ...stepWizard } = props // Destructure stepWizard explicitly
  console.log("Step1: Received props", { formData, stepWizard })

  const [localData, setLocalData] = useState({
    disasterName: formData.disasterName || "",
    fundsRequested: formData.fundsRequested || "",
    startTime: formData.startTime || "",
    endTime: formData.endTime || "",
  })

  const [errors, setErrors] = useState({})

  const validateField = (name, value) => {
    switch (name) {
      case "disasterName":
        return value.trim() ? "" : "Disaster name is required"
      case "fundsRequested":
        return value > 0 ? "" : "Funds requested must be greater than 0"
      case "startTime":
        return value ? "" : "Start time is required"
      case "endTime":
        if (!value) return "End time is required"
        if (localData.startTime && new Date(value) <= new Date(localData.startTime)) {
          return "End time must be after start time"
        }
        return ""
      default:
        return ""
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setLocalData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleNext = () => {
    console.log("Step1: handleNext called with localData:", localData)
    const newErrors = {}
    Object.entries(localData).forEach(([name, value]) => {
      const error = validateField(name, value)
      if (error) newErrors[name] = error
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      console.log("Step1: Validation failed", newErrors)
      return
    }

    updateFormData(localData)
    console.log("Step1: Validation passed, attempting to call nextStep")
    if (stepWizard && typeof stepWizard.nextStep === "function") {
      console.log("Step1: Calling stepWizard.nextStep")
      stepWizard.nextStep()
    } else {
      console.error("Step1: stepWizard.nextStep is not available", stepWizard)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="bg-white rounded-xl p-8 shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center" variants={itemVariants}>
        Basic Information
      </motion.h2>

      <div className="space-y-6">
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Disaster Name</label>
          <div className="relative">
            <input
              type="text"
              name="disasterName"
              value={localData.disasterName}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.disasterName ? "border-red-300 bg-red-50" : "border-gray-300"
              } focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all`}
              placeholder="e.g., Hurricane Relief"
            />
            {errors.disasterName && (
              <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.disasterName}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Funds Requested (USD)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign size={18} className="text-gray-500" />
            </div>
            <input
              type="number"
              name="fundsRequested"
              value={localData.fundsRequested}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                errors.fundsRequested ? "border-red-300 bg-red-50" : "border-gray-300"
              } focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all`}
              placeholder="e.g., 100000"
            />
            {errors.fundsRequested && (
              <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.fundsRequested}
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-500" />
              </div>
              <input
                type="datetime-local"
                name="startTime"
                value={localData.startTime}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  errors.startTime ? "border-red-300 bg-red-50" : "border-gray-300"
                } focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all`}
              />
              {errors.startTime && (
                <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.startTime}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-gray-500" />
              </div>
              <input
                type="datetime-local"
                name="endTime"
                value={localData.endTime}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  errors.endTime ? "border-red-300 bg-red-50" : "border-gray-300"
                } focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all`}
              />
              {errors.endTime && (
                <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.endTime}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <FormNavigation onNext={handleNext} showPrevious={false} stepWizard={stepWizard} />
    </motion.div>
  )
}

export default Step1BasicInfo