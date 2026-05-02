import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMic, FiMicOff, FiVolume2 } from 'react-icons/fi';

const VoiceSearchButton = ({ onResult, onError, className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setConfidence(0);
        
        // Auto-stop after 10 seconds
        timeoutRef.current = setTimeout(() => {
          recognition.stop();
        }, 10000);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          const confidence = result[0].confidence;

          if (result.isFinal) {
            finalTranscript += transcript;
            setConfidence(confidence);
          } else {
            interimTranscript += transcript;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript);

        // If we have a final result, process it
        if (finalTranscript) {
          onResult?.(finalTranscript.trim(), confidence);
          recognition.stop();
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        const errorMessages = {
          'no-speech': 'No speech detected. Please try again.',
          'audio-capture': 'Microphone not accessible. Please check permissions.',
          'not-allowed': 'Microphone access denied. Please enable microphone permissions.',
          'network': 'Network error. Please check your connection.',
          'aborted': 'Speech recognition was aborted.',
          'language-not-supported': 'Language not supported.',
          'service-not-allowed': 'Speech recognition service not allowed.'
        };

        onError?.(errorMessages[event.error] || 'Speech recognition failed. Please try again.');
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onResult, onError]);

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) {
      onError?.('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      onError?.('Failed to start speech recognition. Please try again.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Voice Button */}
      <motion.button
        onClick={handleClick}
        className={`relative p-3 rounded-full transition-all duration-300 ${
          isListening
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
            : 'bg-[#33e0a1]/20 text-[#33e0a1] hover:bg-[#33e0a1]/30 border border-[#33e0a1]/30'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={!isSupported}
      >
        {/* Pulsing animation when listening */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full bg-red-500"
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ 
                scale: [1, 1.3, 1], 
                opacity: [0.7, 0.3, 0.7] 
              }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </AnimatePresence>

        {/* Icon */}
        <div className="relative z-10">
          {isListening ? (
            <FiMicOff className="w-5 h-5" />
          ) : (
            <FiMic className="w-5 h-5" />
          )}
        </div>
      </motion.button>

      {/* Transcript Display */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 min-w-64 max-w-sm"
          >
            <div className="bg-[#121b22]/95 backdrop-blur-md border border-[#33e0a1]/30 rounded-xl p-4 shadow-xl">
              {/* Status */}
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-red-500 rounded-full"
                />
                <span className="text-sm text-[#D0D0D0]/70">Listening...</span>
              </div>

              {/* Transcript */}
              <div className="min-h-[2rem]">
                {transcript ? (
                  <div>
                    <p className="text-[#D0D0D0] text-sm mb-2">
                      "{transcript}"
                    </p>
                    {confidence > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#D0D0D0]/50">Confidence:</span>
                        <div className="flex-1 bg-[#D0D0D0]/20 rounded-full h-1">
                          <motion.div
                            className="bg-[#33e0a1] h-1 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${confidence * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <span className="text-xs text-[#33e0a1]">
                          {Math.round(confidence * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[#D0D0D0]/50 text-sm italic">
                    Start speaking...
                  </p>
                )}
              </div>

              {/* Tips */}
              <div className="mt-3 pt-3 border-t border-[#D0D0D0]/10">
                <p className="text-xs text-[#D0D0D0]/50">
                  Try: "Find Italian restaurants near me" or "Show me pizza places"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Visualization */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-[#33e0a1] rounded-full"
                animate={{
                  height: [4, 12, 4],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceSearchButton;