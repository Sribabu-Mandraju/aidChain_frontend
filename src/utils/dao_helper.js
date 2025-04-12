// Format wallet address to shorter version
export const formatAddress = (address) => {
    if (!address) return ""
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }
  
  // Format currency with $ sign and commas
  export const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }
  
  // Calculate time left until end time
  export const calculateTimeLeft = (endTime) => {
    const now = Date.now()
    const timeLeft = endTime - now
  
    if (timeLeft <= 0) {
      return "Ended"
    }
  
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
    if (days > 0) {
      return `${days} day${days !== 1 ? "s" : ""} left`
    } else {
      return `${hours} hour${hours !== 1 ? "s" : ""} left`
    }
  }
  
  // Format date to readable format
  export const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  
  // Add CSS for animations
  export const addAnimationStyles = () => {
    const style = document.createElement("style")
    style.textContent = `
      @keyframes blob {
        0% {
          transform: translate(0px, 0px) scale(1);
        }
        33% {
          transform: translate(30px, -50px) scale(1.1);
        }
        66% {
          transform: translate(-20px, 20px) scale(0.9);
        }
        100% {
          transform: translate(0px, 0px) scale(1);
        }
      }
      .animate-blob {
        animation: blob 7s infinite;
      }
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      .animation-delay-4000 {
        animation-delay: 4s;
      }
    `
    document.head.appendChild(style)
  }
  