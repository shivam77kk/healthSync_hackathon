"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Play, Pause, FileText, Download } from "lucide-react"
import { Card, CardContent } from "../ui/card"

export default function VoicePrescription() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioURL, setAudioURL] = useState(null)
  const [transcript, setTranscript] = useState("")
  const [prescription, setPrescription] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  const mediaRecorderRef = useRef(null)
  const audioRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript + ' ')
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      const audioChunks = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Microphone access denied or not available')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    // Process the transcript into prescription
    if (transcript.trim()) {
      generatePrescription(transcript)
    }
  }

  const generatePrescription = (text) => {
    setIsProcessing(true)
    
    setTimeout(() => {
      let prescriptionText = "PRESCRIPTION\n\n"
      prescriptionText += `Date: ${new Date().toLocaleDateString()}\n`
      prescriptionText += `Patient Symptoms: ${text}\n\n`
      
      const lowerText = text.toLowerCase()
      let aiResponseText = ""
      
      if (lowerText.includes('headache') || lowerText.includes('head pain')) {
        prescriptionText += "Recommended Treatment:\n• Rest in a dark, quiet room\n• Apply cold compress to forehead\n• Stay hydrated\n• Consider over-the-counter pain relief (as directed)\n"
        aiResponseText = "I understand you're experiencing headaches. Based on your symptoms, I recommend resting in a dark, quiet room and applying a cold compress to your forehead. Make sure to stay hydrated and consider over-the-counter pain relief as directed. If headaches persist or worsen, please consult a healthcare professional."
      } else if (lowerText.includes('fever') || lowerText.includes('temperature')) {
        prescriptionText += "Recommended Treatment:\n• Rest and stay hydrated\n• Monitor temperature regularly\n• Light clothing and cool environment\n• Consider fever reducer if needed\n"
        aiResponseText = "I see you have a fever. It's important to rest and stay well hydrated. Monitor your temperature regularly and wear light clothing in a cool environment. You may consider a fever reducer if your temperature is high. Seek medical attention if fever exceeds 103 degrees Fahrenheit or persists for more than 3 days."
      } else if (lowerText.includes('cough') || lowerText.includes('cold')) {
        prescriptionText += "Recommended Treatment:\n• Plenty of rest\n• Warm fluids (tea with honey)\n• Use humidifier\n• Avoid irritants\n"
        aiResponseText = "For your cough and cold symptoms, I recommend getting plenty of rest and drinking warm fluids like tea with honey. Using a humidifier can help, and make sure to avoid smoke and other irritants. If symptoms worsen or last more than 10 days, please consult your doctor."
      } else {
        prescriptionText += "General Health Recommendations:\n• Maintain adequate rest\n• Stay hydrated\n• Eat nutritious meals\n• Monitor symptoms\n"
        aiResponseText = "Thank you for sharing your symptoms with me. Based on what you've described, I recommend maintaining adequate rest, staying hydrated, and eating nutritious meals. Please monitor your symptoms closely and don't hesitate to consult a healthcare professional if you have any concerns."
      }
      
      prescriptionText += "\nIMPORTANT: This is AI-generated guidance. Please consult a healthcare professional for proper medical advice.\n"
      
      setPrescription(prescriptionText)
      setAiResponse(aiResponseText)
      setIsProcessing(false)
      
      speakResponse(aiResponseText)
    }, 2000)
  }

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const downloadPrescription = () => {
    if (prescription) {
      const element = document.createElement('a')
      const file = new Blob([prescription], { type: 'text/plain' })
      element.href = URL.createObjectURL(file)
      element.download = `prescription_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 1
      
      utterance.onend = () => {
        setIsSpeaking(false)
      }
      
      speechSynthesis.speak(utterance)
    }
  }
  
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const clearAll = () => {
    setTranscript("")
    setPrescription("")
    setAudioURL(null)
    setIsPlaying(false)
    setAiResponse("")
    stopSpeaking()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Voice Prescription Assistant
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Describe your symptoms and get AI-generated health guidance
          </p>
        </div>

        {/* Recording Controls */}
        <div className="flex justify-center mb-6">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isRecording ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </button>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isRecording ? 'Recording... Speak now' : 'Click to start recording'}
          </p>
        </div>

        {/* Audio Playback */}
        {audioURL && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Recorded Audio:</span>
              <button
                onClick={playAudio}
                className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
            <audio
              ref={audioRef}
              src={audioURL}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transcript:
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{transcript}</p>
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Processing your symptoms and generating prescription...
            </p>
          </div>
        )}

        {/* AI Response */}
        {aiResponse && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Response:</h4>
              <div className="flex gap-2">
                {isSpeaking ? (
                  <button
                    onClick={stopSpeaking}
                    className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                  >
                    <Pause className="w-3 h-3" />
                    Stop
                  </button>
                ) : (
                  <button
                    onClick={() => speakResponse(aiResponse)}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                  >
                    <Play className="w-3 h-3" />
                    Speak
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{aiResponse}</p>
          </div>
        )}

        {/* Generated Prescription */}
        {prescription && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Generated Prescription:
              </h4>
              <button
                onClick={downloadPrescription}
                className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
              >
                <Download className="w-3 h-3" />
                Download
              </button>
            </div>
            <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono">
              {prescription}
            </pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear All
          </button>
        </div>
      </CardContent>
    </Card>
  )
}