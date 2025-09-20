import { useState } from 'react';
import { Eye, Download, User, Calendar } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/patient-dashboard/Sidebar';

export default function ReportViewer() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All Reports');
  const [searchTerm, setSearchTerm] = useState('');

  const handleProfileClick = () => {
    router.push('/patient-profile');
  };

  const tabs = ['All Reports', 'MRI', 'CT Scan', 'X-Ray', 'Blood', 'ECG', 'Ultrasound'];

  const reports = [
    {
      id: 1,
      title: 'Brain MRI with Contrast',
      patient: 'Sarah Johnson',
      patientId: 'P001',
      date: '3/19/2024',
      status: 'Normal',
      priority: 'Low Priority',
      description: 'No abnormal findings detected. Brain structure appears normal.',
      type: 'MRI'
    },
    {
      id: 2,
      title: 'Chest X-Ray',
      patient: 'Emma Davis',
      patientId: 'P003',
      date: '3/17/2024',
      status: 'Normal',
      priority: 'Low Priority',
      description: 'Clear lung fields. No signs of infection or abnormalities.',
      type: 'X-Ray'
    },
    {
      id: 3,
      title: 'Chest X-Ray',
      patient: 'Emma Davis',
      patientId: 'P003',
      date: '3/17/2024',
      status: 'Normal',
      priority: 'Low Priority',
      description: 'Clear lung fields. No signs of infection or abnormalities.',
      type: 'X-Ray'
    }
  ];

  const filteredReports = reports.filter(report => {
    const matchesTab = activeTab === 'All Reports' || report.type === activeTab;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.patient.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#c8e6c9] flex">
      <Sidebar />
      
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-[#1e40af] rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl">📋</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1e40af]">Report Viewer</h1>
              <p className="text-[#4a7c59] text-lg">Review and analyze patient reports across different categories</p>
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

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-md transition-all duration-300"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-300 hover:scale-105 ${
                activeTab === tab
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🧠</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                        {report.title}
                      </h3>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {report.status}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {report.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{report.patient} (ID: {report.patientId})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{report.date}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm">
                      {report.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl text-gray-400">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No reports found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}