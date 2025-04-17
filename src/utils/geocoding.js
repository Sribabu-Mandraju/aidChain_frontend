// Indian pincode regions with approximate coordinates
const PINCODE_REGIONS = {
  '1': { lat: 28.7041, lng: 77.1025 }, // Delhi
  '2': { lat: 28.6139, lng: 77.2090 }, // Delhi
  '3': { lat: 28.7041, lng: 77.1025 }, // Delhi
  '4': { lat: 19.0760, lng: 72.8777 }, // Mumbai
  '5': { lat: 19.0760, lng: 72.8777 }, // Mumbai
  '6': { lat: 19.0760, lng: 72.8777 }, // Mumbai
  '7': { lat: 22.5726, lng: 88.3639 }, // Kolkata
  '8': { lat: 22.5726, lng: 88.3639 }, // Kolkata
  '9': { lat: 22.5726, lng: 88.3639 }, // Kolkata
  '0': { lat: 13.0827, lng: 80.2707 }  // Chennai
};

export async function getCoordinatesFromPincode(pincode, state) {
  try {
    // First try with exact pincode and state combination
    const searchQuery = `${pincode}, ${state}, India`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AadhaarVerificationApp/1.0',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          address: data[0].display_name,
          source: 'exact_match'
        };
      }
    }

    // If exact match fails, try with just the pincode
    const pincodeUrl = `https://nominatim.openstreetmap.org/search?format=json&postalcode=${pincode}&country=India`;
    const pincodeResponse = await fetch(pincodeUrl, {
      headers: {
        'User-Agent': 'AadhaarVerificationApp/1.0',
      },
    });

    if (pincodeResponse.ok) {
      const pincodeData = await pincodeResponse.json();
      if (pincodeData && pincodeData.length > 0) {
        return {
          latitude: parseFloat(pincodeData[0].lat),
          longitude: parseFloat(pincodeData[0].lon),
          address: pincodeData[0].display_name,
          source: 'pincode_match'
        };
      }
    }

    // If pincode search fails, try with just the state
    const stateUrl = `https://nominatim.openstreetmap.org/search?format=json&state=${encodeURIComponent(state)}&country=India`;
    const stateResponse = await fetch(stateUrl, {
      headers: {
        'User-Agent': 'AadhaarVerificationApp/1.0',
      },
    });

    if (stateResponse.ok) {
      const stateData = await stateResponse.json();
      if (stateData && stateData.length > 0) {
        // Add some random variation to the coordinates to avoid exact same points
        const variation = 0.1; // Approximately 11km variation
        const latVariation = (Math.random() - 0.5) * variation;
        const lngVariation = (Math.random() - 0.5) * variation;
        
        return {
          latitude: parseFloat(stateData[0].lat) + latVariation,
          longitude: parseFloat(stateData[0].lon) + lngVariation,
          address: `Approximate location in ${state} (Pincode: ${pincode})`,
          source: 'state_approximation'
        };
      }
    }

    // If all else fails, use a default location in India with some variation
    return {
      latitude: 23.5937 + (Math.random() - 0.5) * 0.1,
      longitude: 78.9629 + (Math.random() - 0.5) * 0.1,
      address: `Approximate location in ${state} (Pincode: ${pincode})`,
      source: 'default_approximation'
    };
  } catch (error) {
    console.error('Error getting coordinates:', error);
    // Return a default location with some variation
    return {
      latitude: 23.5937 + (Math.random() - 0.5) * 0.1,
      longitude: 78.9629 + (Math.random() - 0.5) * 0.1,
      address: `Approximate location in ${state} (Pincode: ${pincode})`,
      source: 'fallback'
    };
  }
} 