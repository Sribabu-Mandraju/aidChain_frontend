export const validateProposalForm = (formData, step) => {
    const errors = {}
  
    if (step === 1 || step === 3) {
      if (!formData.disasterName.trim()) {
        errors.disasterName = "Disaster name is required"
      } else if (formData.disasterName.length < 5) {
        errors.disasterName = "Disaster name must be at least 5 characters"
      }
  
      if (!formData.area.trim()) {
        errors.area = "Area is required"
      }
  
      if (!formData.duration || formData.duration < 1) {
        errors.duration = "Duration must be at least 1 day"
      } else if (formData.duration > 365) {
        errors.duration = "Duration cannot exceed 365 days"
      }
  
      if (!formData.fundsRequested || formData.fundsRequested < 1) {
        errors.fundsRequested = "Funds requested must be greater than 0"
      }
    }
  
    if (step === 2 || step === 3) {
      if (!formData.description.trim()) {
        errors.description = "Description is required"
      } else if (formData.description.replace(/<[^>]*>/g, "").trim().length < 50) {
        errors.description = "Description must be at least 50 characters"
      }
  
      if (!formData.image) {
        errors.image = "Image is required"
      }
    }
  
    return errors
  }
  