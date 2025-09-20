import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/patient-dashboard/Sidebar';
import api from '../utils/api';

export default function AIHealthAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await api.sendChatMessage(inputMessage);
      const botMessage = { 
        text: response.response, 
        sender: 'bot', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        text: 'Sorry, I\'m having trouble responding right now. Please try again.', 
        sender: 'bot', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = async (question) => {
    setInputMessage(question);
    await handleSendMessage();
  };

  return (
    <div className="flex min-h-screen bg-[#E8F5E8]">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-[#0A3E1D] mb-2">AI Health Assistant</h1>
            <p className="text-gray-600 mb-6">Get instant answers to your health questions and personalized guidance</p>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#0A3E1D] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <div>
                <div className="font-medium text-[#0A3E1D]">Health Assistant</div>
                <div className="text-sm text-green-600">● Online • Available 24/7</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-4">Quick Questions:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button 
                  onClick={() => handleQuickQuestion('What are my medication side effects?')}
                  className="p-3 bg-gray-50 rounded-lg text-left hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  💊 What are my medication side effects?
                </button>
                <button 
                  onClick={() => handleQuickQuestion('How to improve my sleep quality?')}
                  className="p-3 bg-gray-50 rounded-lg text-left hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  😴 How to improve my sleep quality?
                </button>
                <button 
                  onClick={() => handleQuickQuestion('Healthy diet recommendations')}
                  className="p-3 bg-gray-50 rounded-lg text-left hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  🥗 Healthy diet recommendations
                </button>
                <button 
                  onClick={() => handleQuickQuestion('Schedule a health check reminder')}
                  className="p-3 bg-gray-50 rounded-lg text-left hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  📅 Schedule a health check reminder
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">ℹ️</span>
                </div>
                <div className="text-sm text-blue-800">
                  Hello! I'm your AI Health Assistant. I can help you with health questions, medication reminders, symptom guidance, and wellness tips. How can I assist you today?
                </div>
              </div>
              <div className="text-xs text-blue-600 mt-2">11:15 AM</div>
            </div>

            <div className="max-h-60 overflow-y-auto mb-4">
              {messages.map((message, index) => (
                <div key={index} className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-3 rounded-lg max-w-xs ${
                    message.sender === 'user' 
                      ? 'bg-[#0A3E1D] text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-left mb-3">
                  <div className="inline-block p-3 rounded-lg bg-gray-100 text-gray-800">
                    Typing...
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="What are my medication side effects?"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3E1D] transition-all duration-300 hover:shadow-md"
              />
              <button 
                onClick={handleSendMessage}
                disabled={loading}
                className="px-6 py-3 bg-[#0A3E1D] text-white rounded-lg hover:bg-[#083319] transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}