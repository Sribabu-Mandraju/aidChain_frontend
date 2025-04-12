import React, { useState, useEffect } from "react";
import { AnonAadhaarProvider, LogInWithAnonAadhaar, useAnonAadhaar } from "@anon-aadhaar/react";
import QrScanner from "react-qr-scanner"; // New library

const ZkAadhaarAuth = () => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [qrData, setQrData] = useState("");
  const [anonAadhaar] = useAnonAadhaar();
  const contractAddress = "0xPlaceholderContractAddress";

  const handleScan = (data) => {
    if (data && data.text) {
      setQrData(data.text);
      setShowScanner(false);
      setStatus("QR code scanned. Please use file upload or test mode to generate proof.");
    }
  };

  const handleError = (err) => {
    console.error(err);
    setStatus("Error scanning QR code. Try uploading a file instead.");
  };

  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      try {
        const { nullifier } = anonAadhaar.anonAadhaarProof;
        console.log("Nullifier:", nullifier);
        setStatus(`Proof generated! Nullifier logged to console: ${nullifier}`);
      } catch (error) {
        console.error("Error accessing nullifier:", error);
        setStatus("Error accessing nullifier. Check console.");
      }
    }
  }, [anonAadhaar.status]);

  const handleGenerateProof = async () => {
    if (qrData && anonAadhaar.status !== "logged-in") {
      setStatus("QR data available, but login required. Use Anon Aadhaar login.");
      return;
    }

    if (anonAadhaar.status === "logged-in") {
      setStatus("Proof already generated. Nullifier logged to console.");
      return;
    }

    setLoading(true);
    setStatus("Waiting for Anon Aadhaar login...");

    try {
      setStatus("Please complete Anon Aadhaar login to generate proof.");
    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnonAadhaarProvider>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2>Generate Aadhaar Nullifier</h2>

        <div>
          <button
            onClick={() => setShowScanner(!showScanner)}
            style={{ padding: "8px 16px", margin: "10px" }}
          >
            {showScanner ? "Hide Scanner" : "Scan Aadhaar QR Code"}
          </button>
          {showScanner && (
            <div style={{ margin: "10px" }}>
              <QrScanner
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: "100%", maxWidth: "300px" }}
              />
            </div>
          )}
          {qrData && (
            <p>Scanned QR Data: {qrData.slice(0, 20)}...</p>
          )}
        </div>

        <LogInWithAnonAadhaar
          fieldsToReveal={[]}
          nullifierSeed={1234}
          signal={contractAddress}
          testing={true}
        />
        <p>Anon Aadhaar Status: {anonAadhaar.status}</p>

        <button
          onClick={handleGenerateProof}
          disabled={loading}
          style={{ padding: "10px 20px", margin: "10px" }}
        >
          {loading ? "Processing..." : "Generate Proof"}
        </button>

        <p>
          No QR code? Use the Anon Aadhaar file upload above or test mode.
        </p>

        <p style={{ color: loading ? "gray" : "black" }}>{status}</p>
      </div>
    </AnonAadhaarProvider>
  );
};

export default ZkAadhaarAuth;