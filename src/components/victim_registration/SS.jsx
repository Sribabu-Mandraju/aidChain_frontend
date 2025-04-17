// import bg from '../assets/desibg.jpg';
import { useEffect, useState } from 'react';
import {
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  useProver,
  AnonAadhaarProvider
} from '@anon-aadhaar/react';

function AnonProofContent() {
    const [anonAadhaar] = useAnonAadhaar();
    const [, latestProof] = useProver();
    const [verificationStatus, setVerificationStatus] = useState('idle');
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Anon Aadhaar status:', anonAadhaar.status);
        console.log('Anon Aadhaar proof:', anonAadhaar.anonAadhaarProof);
        console.log('Latest proof:', latestProof);

        if (anonAadhaar.status === 'logged-in') {
            console.log('Verification successful!');
            setVerificationStatus('success');
            setError(null);
        } else if (anonAadhaar.status === 'error') {
            console.error('Verification error:', anonAadhaar.error);
            setVerificationStatus('error');
            setError(anonAadhaar.error || 'Verification failed. Please try again.');
        } else if (anonAadhaar.status === 'logging-in') {
            console.log('Generating proof...');
            setVerificationStatus('processing');
            setError(null);
        }
    }, [anonAadhaar, latestProof]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-light text-gray-800">Indian Identity Verification</h1>
                    <p className="text-xl text-gray-600 font-light">
                        Verify your Indian identity by submitting an Aadhaar QR code.
                    </p>
                    
                    <div className="w-full max-w-md">
                        <LogInWithAnonAadhaar
                            nullifierSeed={1234}
                            fieldsToReveal={[]}
                            _useTestAadhaar={true}
                            signal={1234}
                            className="w-full bg-gray-800 text-white py-3 px-8 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors duration-300"
                        />
                    </div>

                    <div className="w-full max-w-md">
                        {verificationStatus === 'processing' && (
                            <div className="flex items-center justify-center space-x-2 text-gray-700">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                                <span>Verifying your identity...</span>
                            </div>
                        )}
                        
                        {verificationStatus === 'error' && (
                            <div className="text-red-600 bg-red-50 p-3 rounded-lg">
                                {error}
                            </div>
                        )}
                        
                        {verificationStatus === 'success' && (
                            <div className="text-green-600 bg-green-50 p-3 rounded-lg">
                                <div className="flex items-center justify-center space-x-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Identity verified successfully!</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Debug info only shown in development */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="w-full max-w-md text-left">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Debug Info:</h3>
                            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                                Status: {anonAadhaar?.status}
                                {anonAadhaar?.error && `\nError: ${anonAadhaar.error}`}
                                {latestProof && `\nProof Available: Yes`}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AnonProof() {
    return (
        <AnonAadhaarProvider>
            <AnonProofContent />
        </AnonAadhaarProvider>
    );
}
