"use client"

import { useState } from "react"
import { Mic, Brain, MessageCircle, Send } from "lucide-react"
import { Card, CardContent } from "../ui/card"

export default function AIAssistant({ assistantData }) {
  const { quickCommands } = assistantData
  const [isListening, setIsListening] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const getSmartResponse = (message) => {
    const msg = message.toLowerCase()
    
    if (msg.includes('headache') || msg.includes('head pain')) {
      return "🩺 For headaches: Rest in a dark room, apply cold compress, stay hydrated, and avoid loud noises. If severe or persistent, consult a doctor immediately."
    }
    if (msg.includes('fever') || msg.includes('temperature')) {
      return "🌡️ For fever: Rest, drink fluids, use light clothing. Take fever reducer if over 101°F. Seek medical help if fever exceeds 103°F or lasts over 3 days."
    }
    if (msg.includes('cough') || msg.includes('cold')) {
      return "🤧 For cough/cold: Rest, warm fluids with honey, use humidifier, avoid irritants. See doctor if symptoms worsen or last over 10 days."
    }
    if (msg.includes('stomach') || msg.includes('nausea') || msg.includes('vomit')) {
      return "🤢 For stomach issues: Try BRAT diet, small sips of water, avoid dairy. Seek help if severe pain, blood, or dehydration occurs."
    }
    if (msg.includes('chest pain') || msg.includes('heart')) {
      return "⚠️ URGENT: Chest pain can be serious. If experiencing chest pain with shortness of breath, sweating, or nausea, call emergency services immediately!"
    }
    if (msg.includes('breathing') || msg.includes('shortness of breath')) {
      return "🫁 Breathing difficulties can be serious. Sit upright, stay calm. If severe or persistent, seek immediate medical attention."
    }
    if (msg.includes('sleep') || msg.includes('insomnia') || msg.includes('tired')) {
      return "😴 Better sleep: Regular bedtime, dark cool room, no screens 1hr before bed, avoid caffeine after 2PM. Adults need 7-9 hours nightly."
    }
    if (msg.includes('exercise') || msg.includes('workout') || msg.includes('fitness')) {
      return "💪 Exercise tips: Start with 150min/week moderate activity. Walking, swimming, cycling are great. Begin slowly, increase gradually."
    }
    if (msg.includes('diet') || msg.includes('nutrition') || msg.includes('food')) {
      return "🥗 Healthy eating: 5-9 fruits/vegetables daily, whole grains, lean proteins, healthy fats. Limit processed foods, sugar, excess salt."
    }
    if (msg.includes('stress') || msg.includes('anxiety') || msg.includes('mental health')) {
      return "🧘 Stress management: Deep breathing, regular exercise, adequate sleep, social connections. Try meditation or yoga. Seek help if overwhelming."
    }
    if (msg.includes('medication') || msg.includes('medicine') || msg.includes('drug')) {
      return "💊 Medication safety: Take as prescribed, don't share, check expiration dates, inform doctors of all medications to avoid interactions."
    }
    if (msg.includes('symptoms') || msg.includes('what are my symptoms')) {
      return "📋 Common symptoms I can help with: headaches, fever, cough, stomach issues, sleep problems, stress, and general health questions. What's bothering you?"
    }
    if (msg.includes('emergency') || msg.includes('urgent')) {
      return "🚨 For emergencies: Call 911 immediately. Signs needing urgent care: chest pain, difficulty breathing, severe bleeding, loss of consciousness, severe allergic reactions."
    }
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "👋 Hello! I'm your AI Health Assistant. I provide general health guidance for common symptoms and wellness tips. How can I help you today?"
    }
    if (msg.includes('thank') || msg.includes('thanks')) {
      return "😊 You're welcome! Remember, I provide general guidance only. Always consult healthcare professionals for personalized medical advice. Anything else I can help with?"
    }
    
    return "🤖 I'm here to help with health questions! I can provide guidance on symptoms like headaches, fever, cough, stomach issues, sleep, diet, exercise, and stress. What would you like to know?"
  }

  const sendMessage = async (message) => {
    if (!message.trim()) return
    
    const userMessage = { text: message, sender: 'user', timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // Use local AI response directly
    setTimeout(() => {
      const botResponse = getSmartResponse(message)
      const botMessage = { 
        text: botResponse, 
        sender: 'bot', 
        timestamp: new Date() 
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleQuickCommand = (command) => {
    setShowChat(true)
    sendMessage(command)
  }

  return (
    <Card className="col-span-3 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
      <CardContent className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-blue-500 group-hover:animate-pulse" />
          <h3 className="font-semibold text-gray-800 dark:text-white">AI Health Assistant</h3>
        </div>

        <div
          className={`w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 cursor-pointer group-hover:scale-110 group-hover:shadow-lg ${
            isListening ? "animate-pulse bg-green-500" : "hover:bg-blue-600"
          }`}
          onClick={() => setShowChat(!showChat)}
        >
          <Mic className="w-8 h-8 text-white" />
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Tap to Chat</p>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1 mb-2">
            <MessageCircle className="w-3 h-3 text-gray-400 dark:text-gray-500" />
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Quick Commands</p>
          </div>
          <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
            {quickCommands && Array.isArray(quickCommands) ? quickCommands.map((command, index) => (
              <p
                key={index}
                className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:scale-105 p-1 rounded hover:bg-blue-50 dark:hover:bg-gray-700"
                onClick={() => handleQuickCommand(command)}
              >
                🔹 {command}
              </p>
            )) : (
              <div className="space-y-1">
                <p className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:scale-105 p-1 rounded hover:bg-blue-50 dark:hover:bg-gray-700" onClick={() => handleQuickCommand("What are my symptoms?")}>🔹 What are my symptoms?</p>
                <p className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:scale-105 p-1 rounded hover:bg-blue-50 dark:hover:bg-gray-700" onClick={() => handleQuickCommand("Health tips for today")}>🔹 Health tips for today</p>
                <p className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-all duration-200 hover:scale-105 p-1 rounded hover:bg-blue-50 dark:hover:bg-gray-700" onClick={() => handleQuickCommand("Check my medications")}>🔹 Check my medications</p>
              </div>
            )}
          </div>
        </div>

        {showChat && (
          <div className="mt-4 border-t border-gray-200 dark:border-gray-600 pt-4">
            <div className="h-40 overflow-y-auto mb-3 space-y-2 text-left">
              {messages.map((msg, index) => (
                <div key={index} className={`p-2 rounded text-xs ${
                  msg.sender === 'user' ? 'bg-blue-100 dark:bg-blue-900 ml-4' : 'bg-gray-100 dark:bg-gray-700 mr-4'
                }`}>
                  <p className="text-gray-800 dark:text-white">{msg.text}</p>
                </div>
              ))}
              {isLoading && (
                <div className="bg-gray-100 dark:bg-gray-700 mr-4 p-2 rounded text-xs">
                  <p className="text-gray-600 dark:text-gray-300">Thinking...</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => sendMessage(inputMessage)}
                disabled={isLoading}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
