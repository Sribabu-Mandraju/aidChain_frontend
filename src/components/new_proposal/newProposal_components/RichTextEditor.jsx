import { useState, useEffect } from "react";

const TextArea = ({
  value = "",
  onChange,
  error,
  placeholder = "Write your content here...",
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Handle mounting for SSR compatibility
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  // Handle textarea change
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  // Loading state
  if (!isMounted) {
    return (
      <div className="textarea-fallback" style={styles.fallback}>
        Loading...
      </div>
    );
  }

  return (
    <div
      className={`textarea-container ${error ? "textarea-error" : ""} ${
        isFocused ? "textarea-focused" : ""
      }`}
      style={styles.container}
    >
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="textarea-element"
        style={styles.textarea}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error && (
        <div className="textarea-error-message" style={styles.errorMessage}>
          {error}
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    position: "relative",
    padding: "8px",
    borderRadius: "12px",
    background: "linear-gradient(145deg, #f5f7fa, #e4e7eb)",
    boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.1), -4px -4px 12px rgba(255, 255, 255, 0.8)",
    transition: "all 0.3s ease",
  },
  textarea: {
    width: "100%",
    minHeight: "150px",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#ffffff",
    fontSize: "14px",
    fontFamily: "'Inter', sans-serif",
    color: "#333",
    resize: "vertical",
    outline: "none",
    boxShadow: "inset 2px 2px 5px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease",
  },
  errorMessage: {
    color: "#e63946",
    fontSize: "12px",
    marginTop: "6px",
    fontFamily: "'Inter', sans-serif",
  },
  fallback: {
    padding: "16px",
    textAlign: "center",
    color: "#666",
    fontFamily: "'Inter', sans-serif",
  },
};

// CSS for enhanced visuals and animations
const css = `
  .textarea-container {
    max-width: 100%;
    margin: 0 auto;
  }

  .textarea-container.textarea-error {
    background: linear-gradient(145deg, #f7d7d7, #f0c7c7);
    box-shadow: 4px 4px 12px rgba(230, 57, 70, 0.2), -4px -4px 12px rgba(255, 255, 255, 0.8);
  }

  .textarea-container.textarea-focused {
    transform: translateY(-2px);
    box-shadow: 6px 6px 16px rgba(0, 0, 0, 0.15), -6px -6px 16px rgba(255, 255, 255, 0.9);
  }

  .textarea-element {
    box-sizing: border-box;
  }

  .textarea-element::placeholder {
    color: #a0a4a8;
    font-style: italic;
  }

  .textarea-element:focus {
    background: #f8fafc;
    box-shadow: inset 0 0 0 2px #5c7cfa, inset 3px 3px 8px rgba(0, 0, 0, 0.05);
  }

  .textarea-error .textarea-element {
    box-shadow: inset 0 0 0 2px #e63946, inset 2px 2px 5px rgba(0, 0, 0, 0.1);
  }

  .textarea-error-message {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Ensure responsiveness */
  @media (max-width: 600px) {
    .textarea-container {
      padding: 6px;
    }
    .textarea-element {
      padding: 10px;
      font-size: 13px;
    }
  }
`;

// Inject CSS into the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = css;
  document.head.appendChild(styleSheet);
}

export default TextArea;