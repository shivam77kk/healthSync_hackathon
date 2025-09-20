import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, X } from 'lucide-react';

export default function AIHealthAssistantPopup({ isOpen, onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hello! I'm your AI Health Assistant. I can help you with health questions, medication reminders, symptom guidance, and wellness tips. How can I help you today?",
      time: '10:14 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleMicClick = () => {
    if (!isListening) {
      setIsListening(true);
      setIsRecording(true);
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        setIsRecording(false);
        setShowChat(true);
      }, 2000);
    } else {
      setIsListening(false);
      setIsRecording(false);
      setShowChat(true);
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        text: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, newMessage]);
      setInputText('');
      
      // Simulate AI response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          text: "I understand your concern. Based on what you've shared, I recommend consulting with a healthcare professional for a proper evaluation. In the meantime, here are some general wellness tips that might help.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {!showChat ? (
          // Initial Voice Interface
          <div className="bg-green-600 text-white p-8 text-center relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-green-700 rounded-full p-2 transition-colors duration-300"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold mb-8">AI Health Assistant</h2>
            
            <div className="mb-8">
              <button
                onClick={handleMicClick}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500 animate-pulse scale-110' 
                    : 'bg-white hover:bg-gray-100 hover:scale-105'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-green-600" />
                )}
              </button>
            </div>
            
            <p className="text-lg font-medium">
              {isListening ? 'Listening...' : 'Tap to Speak'}
            </p>
            
            {isRecording && (
              <div className="mt-4">
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Chat Interface
          <div className="flex flex-col h-96">
            {/* Header */}
            <div className="bg-green-100 p-4 flex items-center justify-between border-b">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleMicClick}
                  className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center hover:bg-green-300 transition-colors duration-300"
                >
                  <Mic className="w-5 h-5 text-green-600" />
                </button>
                <span className="text-sm text-gray-600">Tap to Speak</span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your health, medications, or wellness tips..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
                <button
                  onClick={handleMicClick}
                  className="p-2 text-gray-500 hover:text-green-600 transition-colors duration-300"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}