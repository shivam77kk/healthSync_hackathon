import { useState, useEffect } from 'react';
import { Upload, Download, Eye } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/patient-dashboard/Sidebar';
import api from '../utils/api';

export default function MedicalReports() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const response = await api.getDocuments();
    setDocuments(response?.documents || []);
    setLoading(false);
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('documentFile', file);
      await api.uploadDocument(formData);
      fetchDocuments();
    }
  };

  const handleProfileClick = () => {
    router.push('/patient-profile');
  };

  const reportCategories = [
    { name: 'All Reports', count: 6 },
    { name: 'MRI Scan', count: 6 },
    { name: 'CT Scan', count: 6 },
    { name: 'X-Ray', count: 6 },
    { name: 'Blood Tests', count: 6 },
    { name: 'ECG', count: 6 }
  ];

  const reports = [
    {
      title: 'Chest X-Ray Report',
      date: '3/15/2024',
      doctor: 'Dr. Dr. Johnson',
      hospital: 'City General Hospital',
      description: 'Routine chest examination - clear lungs, normal cardiac silhouette'
    },
    {
      title: 'Chest X-Ray Report',
      date: '3/15/2024',
      doctor: 'Dr. Dr. Johnson',
      hospital: 'City General Hospital',
      description: 'Routine chest examination - clear lungs, normal cardiac silhouette'
    }
  ];

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
              <h1 className="text-3xl font-bold text-[#2d5016]">Medical Reports</h1>
              <p className="text-[#4a7c59] text-lg">Store and organize your medical documents</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleProfileClick}
              className="flex items-center space-x-3 bg-[#4a7c59] px-6 py-3 rounded-full hover:bg-[#3d6b4a] transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="w-8 h-8 bg-[#a8d5ba] rounded-full"></div>
              <span className="text-white font-medium">{user?.name || 'Sam Cha'}</span>
            </button>
            
            <label className="bg-[#4a7c59] text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#3d6b4a] transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2 cursor-pointer">
              <Upload className="w-5 h-5" />
              <span>Upload Report</span>
              <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.jpg,.jpeg,.png" />
            </label>
          </div>
        </div>

        {/* Select Report Dropdown */}
        <div className="mb-6">
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4a7c59] text-gray-500 text-lg transition-all duration-300 hover:shadow-md"
          >
            <option value="">Select Report</option>
            <option value="xray">X-Ray</option>
            <option value="mri">MRI Scan</option>
            <option value="ct">CT Scan</option>
          </select>
        </div>

        {/* Report Categories Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {reportCategories.map((category, index) => (
            <button
              key={index}
              className="bg-white rounded-2xl p-6 text-center hover:bg-[#f0f9f0] transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-[#4a7c59] group"
            >
              <h3 className="text-xl font-semibold text-[#2d5016] mb-2 group-hover:text-[#4a7c59] transition-colors duration-300">
                {category.name}
              </h3>
              <p className="text-[#4a7c59] text-lg group-hover:text-[#2d5016] transition-colors duration-300">
                {category.count} Files
              </p>
            </button>
          ))}
        </div>

        {/* All Reports Section */}
        <div className="bg-[#4a7c59] rounded-3xl p-6">
          <h2 className="text-white text-2xl font-semibold mb-6">All Reports (6 files)</h2>
          
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div
                key={index}
                className="bg-[#6b9c7a] rounded-2xl p-6 hover:bg-[#7ba889] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group"
              >
                <h3 className="text-white text-xl font-semibold mb-3 group-hover:text-[#e8f5e8] transition-colors duration-300">
                  {report.title}
                </h3>
                
                <div className="flex items-center space-x-6 text-[#d4e6d4] text-sm mb-4">
                  <span>{report.date}</span>
                  <span>{report.doctor}</span>
                  <span>{report.hospital}</span>
                </div>
                
                <p className="text-[#d4e6d4] mb-4 group-hover:text-white transition-colors duration-300">
                  {report.description}
                </p>
                
                <div className="flex space-x-4">
                  <button className="bg-[#4a7c59] text-white px-6 py-2 rounded-xl hover:bg-[#3d6b4a] transition-all duration-300 hover:scale-105 hover:shadow-md flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  
                  <button className="bg-[#4a7c59] text-white px-6 py-2 rounded-xl hover:bg-[#3d6b4a] transition-all duration-300 hover:scale-105 hover:shadow-md flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}