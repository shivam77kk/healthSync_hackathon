import { useState } from 'react';
import { AlertTriangle, Search, Plus } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/patient-dashboard/Sidebar';
import api from '../utils/api';

export default function HealthAssessment() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [duration, setDuration] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProfileClick = () => {
    router.push('/patient-profile');
  };

  const handleAnalyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }

    setLoading(true);
    try {
      const response = await api.getPredictiveScore();
      setAssessmentResult(response);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      alert('Error analyzing symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const symptomCategories = {
    General: ['Fever', 'Headache', 'Fatigue', 'Dizziness'],
    Respiratory: ['Cough', 'Sore Throat', 'Shortness of Breath', 'Chest Pain'],
    Digestive: ['Nausea'],
    Musculoskeletal: ['Muscle Aches']
  };

  const healthTips = [
    'Stay hydrated by drinking 8-10 glasses of water daily',
    'Maintain regular exercise and healthy eating habits',
    'Get 7-9 hours of quality sleep each night',
    'Schedule regular check-ups with your healthcare provider'
  ];

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim()) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  return (
    <div className="min-h-screen bg-[#c8e6c9] flex">
      <Sidebar />
      
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-[#4a7c59] rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">+</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2d5016]">Health Assessment Tool</h1>
              <p className="text-[#4a7c59] text-lg">Analyze your symptoms and get personalized health guidance</p>
            </div>
          </div>
          
          <button 
            onClick={handleProfileClick}
            className="flex items-center space-x-3 bg-[#4a7c59] px-6 py-3 rounded-full hover:bg-[#3d6b4a] transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="w-8 h-8 bg-[#a8d5ba] rounded-full"></div>
            <span className="text-white font-medium">{user?.name || 'Sam Cha'}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Assessment Form */}
          <div className="col-span-2">
            {/* Medical Disclaimer */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-800 mb-2">Important Medical Disclaimer</h3>
                  <p className="text-sm text-orange-700">
                    This tool provides general health information only and should not replace professional medical advice. For serious symptoms or emergencies, contact your healthcare provider immediately or call emergency services.
                  </p>
                </div>
              </div>
            </div>

            {/* Symptoms Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-2 mb-4">
                <Search className="w-5 h-5 text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-800">Select Your Symptoms</h2>
              </div>
              <p className="text-gray-600 mb-6">Choose all symptoms you're currently experiencing</p>

              {/* Symptom Categories */}
              <div className="space-y-6">
                {Object.entries(symptomCategories).map(([category, symptoms]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-gray-700 mb-3">{category}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {symptoms.map((symptom) => (
                        <button
                          key={symptom}
                          onClick={() => toggleSymptom(symptom)}
                          className={`p-3 rounded-lg text-left transition-all duration-300 hover:scale-105 hover:shadow-md ${
                            selectedSymptoms.includes(symptom)
                              ? 'bg-[#4a7c59] text-white shadow-lg'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {symptom}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Symptom */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-3">Add Custom Symptom</h3>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Describe your symptom..."
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a7c59] transition-all duration-300 hover:shadow-md"
                  />
                  <button
                    onClick={addCustomSymptom}
                    className="bg-[#4a7c59] text-white px-6 py-3 rounded-lg hover:bg-[#3d6b4a] transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Duration */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-3">How long have you had these symptoms?</h3>
                <input
                  type="text"
                  placeholder="e.g. 2 days, 1 week..."
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a7c59] transition-all duration-300 hover:shadow-md"
                />
              </div>

              {/* Additional Information */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-3">Additional Information (Optional)</h3>
                <textarea
                  placeholder="Any additional details about your symptoms, triggers, or concerns..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a7c59] transition-all duration-300 hover:shadow-md resize-none"
                />
              </div>

              {/* Analyze Button */}
              <button 
                onClick={handleAnalyzeSymptoms}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-4 rounded-2xl font-semibold mt-6 hover:bg-blue-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Search className="w-5 h-5" />
                <span>{loading ? 'Analyzing...' : 'Analyze Symptoms'}</span>
              </button>

              {/* Assessment Result */}
              {assessmentResult && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Assessment Result</h3>
                  <p className="text-blue-700">{assessmentResult.message || 'Assessment completed successfully'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Health Tips */}
          <div>
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">General Health Tips</h2>
              <div className="space-y-4">
                {healthTips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-green-50 transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 group-hover:scale-150 transition-transform duration-300"></div>
                    <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}