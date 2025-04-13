import { useState } from "react";

const sampleImages = [
  {
    url:
      "https://images.unsplash.com/photo-1542393545-10f5b85e14fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    label: "Hurricane",
  },
  {
    url:
      "https://images.unsplash.com/photo-1610550603158-91f50474b235?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    label: "Earthquake",
  },
  {
    url:
      "https://images.unsplash.com/photo-1595854341625-fc2528d3b11e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    label: "Flood",
  },
  {
    url:
      "https://images.unsplash.com/photo-1500994340878-40ce894df491?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    label: "Wildfire",
  },
  {
    url:
      "https://images.unsplash.com/photo-1594367031514-3aee0295ec98?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    label: "Drought",
  },
  {
    url:
      "https://images.unsplash.com/photo-1603720999656-f4113d07e252?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    label: "Tornado",
  },
];

const ImageUploadField = ({ value, onChange, label }) => {
  const [customUrl, setCustomUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleSelectImage = (url) => {
    onChange(url);
  };

  const handleCustomUrlChange = (e) => {
    setCustomUrl(e.target.value);
  };

  const handleCustomUrlSubmit = () => {
    if (customUrl.trim()) {
      onChange(customUrl);
      setShowUrlInput(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="mb-4">
        <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={value || "/placeholder.svg"}
            alt="Selected campaign image"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Select from sample images:
        </h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {sampleImages.map((image, index) => (
            <div
              key={index}
              onClick={() => handleSelectImage(image.url)}
              className={`cursor-pointer rounded-lg overflow-hidden h-16 border-2 transition-all ${
                value === image.url
                  ? "border-emerald-500 ring-2 ring-emerald-500/50"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.label}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {showUrlInput ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customUrl}
            onChange={handleCustomUrlChange}
            placeholder="Enter image URL"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={handleCustomUrlSubmit}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Use
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowUrlInput(true)}
          className="text-emerald-600 hover:text-emerald-800 text-sm font-medium flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Use custom image URL
        </button>
      )}
    </div>
  );
};

export default ImageUploadField;
