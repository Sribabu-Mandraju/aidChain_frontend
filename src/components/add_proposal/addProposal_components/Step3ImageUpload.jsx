"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import FormNavigation from "./FormNavigation"
import { Upload, ImageIcon, X, AlertCircle, Check } from "lucide-react"

const Step3ImageUpload = (props) => {
  const { formData, updateFormData, ...stepWizard } = props
  console.log("Step3: Received props", { formData, stepWizard })

  const [imagePreview, setImagePreview] = useState(formData.image || null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"]
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF)")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    setError("")
    setImagePreview(URL.createObjectURL(file))
    uploadImage(file)
  }

  const uploadImage = async (file) => {
    setUploading(true)
    setUploadProgress(0)
    setUploadSuccess(false)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset","futureX")

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_NAME || "your_cloud_name"
        }/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percentCompleted)
          },
        },
      )

      updateFormData({ image: response.data.secure_url })
      setUploadSuccess(true)
      setError("")
    } catch (error) {
      console.error("Image upload error:", error)
      setError("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setUploadSuccess(false)
    updateFormData({ image: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handlePrevious = () => {
    console.log("Step3: Navigating to previous step")
    if (stepWizard && typeof stepWizard.previousStep === "function") {
      stepWizard.previousStep()
    } else {
      console.error("Step3: stepWizard.previousStep is not available", stepWizard)
    }
  }

  const handleNext = () => {
    console.log("Step3: handleNext called with formData.image:", formData.image)
    if (!formData.image) {
      setError("Please upload an image for your campaign")
      console.log("Step3: Validation failed - no image")
      return
    }
    console.log("Step3: Validation passed, attempting to call nextStep")
    if (stepWizard && typeof stepWizard.nextStep === "function") {
      console.log("Step3: Calling stepWizard.nextStep")
      stepWizard.nextStep()
    } else {
      console.error("Step3: stepWizard.nextStep is not available", stepWizard)
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
        <ImageIcon className="mr-2" size={24} />
        Campaign Image
      </motion.h2>

      <div className="space-y-6">
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload a compelling image for your campaign
          </label>

          <div className="flex flex-col items-center justify-center w-full">
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-green-200 rounded-xl cursor-pointer hover:bg-green-50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                  <Upload className="w-12 h-12 text-green-500 mb-3" />
                  <p className="text-lg text-gray-700 font-medium">
                    {uploading ? "Uploading..." : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-sm text-gray-500 text-center mt-1">PNG, JPG, GIF (max. 5MB)</p>
                  <p className="text-xs text-gray-400 mt-4 text-center">
                    Choose an image that represents your campaign and will resonate with potential donors
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={uploading}
                  ref={fileInputRef}
                />
              </label>
            ) : (
              <div className="relative w-full">
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-md">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Campaign Preview"
                    className="w-full h-64 object-cover"
                  />

                  {uploadSuccess && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1 shadow-lg">
                      <Check size={16} />
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleRemoveImage}
                    className="absolute top-3 left-3 bg-white text-gray-700 rounded-full p-2 shadow-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </motion.button>

                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3 text-sm">
                    Campaign Image
                  </div>
                </div>

                {uploading && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-3 text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {uploadSuccess && (
              <div className="mt-3 text-green-500 text-sm flex items-center gap-1">
                <Check size={14} />
                Image uploaded successfully!
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Tips for effective campaign images:</h3>
          <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
            <li>Use high-quality, clear images that tell a story</li>
            <li>Show the impact or need your campaign addresses</li>
            <li>Avoid text-heavy images - let the image speak for itself</li>
            <li>Ensure you have permission to use the image</li>
          </ul>
        </motion.div>
      </div>

      <FormNavigation onPrevious={handlePrevious} onNext={handleNext} stepWizard={stepWizard} />
    </motion.div>
  )
}

export default Step3ImageUpload