import { useState } from 'react';
import { Play, Download, Trash2 } from 'lucide-react';
import Sidebar from '../components/patient-dashboard/Sidebar';

export default function VoiceNotes() {
  const [activeTab, setActiveTab] = useState('All Notes');

  const tabs = [
    { name: 'All Notes', count: 4 },
    { name: 'Patient Visits', count: 1 },
    { name: 'Reminders', count: 1 },
    { name: 'Diagnosis', count: 1 },
    { name: 'Personal', count: 1 }
  ];

  return (
    <div className="min-h-screen bg-[#c8e6c9] flex">
      <Sidebar />
      
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 w-64 rounded-lg border border-gray-300"
          />
          
          <div className="flex items-center space-x-3 bg-[#4a7c59] px-6 py-3 rounded-full">
            <div className="w-8 h-8 bg-[#a8d5ba] rounded-full"></div>
            <span className="text-white font-medium">Sam Cha</span>
          </div>
        </div>

        {/* Voice Notes Section */}
        <div className="bg-white rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Voice Notes</h1>
          <p className="text-gray-600 mb-6">Record and manage your voice notes and dictations</p>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search voice notes..."
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                  activeTab === tab.name
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span>{tab.name}</span>
                <span className="px-2 py-1 rounded-full text-xs bg-gray-300 text-gray-600">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-4">
            {/* Note 1 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-sm text-blue-600">SJ</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-800">Sarah Johnson - Post Consultation Notes</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">patient visit</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    📅 2024-03-19 10:35 AM • 🎵 2:41 • 👤 ID: P001
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4">
                Patient reported feeling Lisinopril. Blood pressure reading shows good control at 135/85. Patient education provided on diet and exercise. Follow-up appointment scheduled in 4 weeks.
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">blood-pressure</span>
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">medication-review</span>
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">follow-up</span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Note 2 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-sm text-purple-600">MB</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-800">Complex Case - Michael Brown Diagnosis</h3>
                    <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">diagnosis</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    📅 2024-03-18 03:20 PM • 🎵 4:12 • 👤 ID: P004
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4">
                Patient presents with recurring abdominal pain. CT scan shows possible inflammation. Differential diagnosis includes IBD versus IBS. Recommend gastroenterology referral and additional testing including colonoscopy.
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">differential-diagnosis</span>
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">referral</span>
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">gastroenterology</span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Note 3 */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-sm text-purple-600">MB</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-800">Complex Case - Michael Brown Diagnosis</h3>
                    <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">diagnosis</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    📅 2024-03-18 03:20 PM • 🎵 4:12 • 👤 ID: P004
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4">
                Patient presents with recurring abdominal pain. CT scan shows possible inflammation. Differential diagnosis includes IBD versus IBS. Recommend gastroenterology referral and additional testing including colonoscopy.
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">differential-diagnosis</span>
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">referral</span>
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">gastroenterology</span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}