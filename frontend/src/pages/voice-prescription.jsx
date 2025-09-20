import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Save, Trash2, Edit, Eye, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/patient-dashboard/Sidebar';
import api from '../utils/api';

export default function VoicePrescription() {
  const router = useRouter();
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [transcription, setTranscription] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [patients] = useState([
    { id: 'sarah', name: 'Sarah Johnson', patientId: 'P001' },
    { id: 'robert', name: 'Robert Smith', patientId: 'P002' },
    { id: 'john', name: 'John Doe', patientId: 'P003' }
  ]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([
    {
      id: 1,
      patientName: 'Sarah Johnson',
      patientId: 'P001',
      date: '2024-03-19 10:30 AM',
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      duration: '30 days',
      notes: 'Take with food in the morning',
      alert: false
    },
    {
      id: 2,
      patientName: 'Robert Smith',
      patientId: 'P002',
      date: '2024-03-19 11:15 AM',
      medication: 'Warfarin',
      dosage: '5mg',
      frequency: 'Once daily',
      duration: '90 days',
      notes: 'Monitor INR levels weekly',
      alert: true,
      alertMessage: 'Drug interaction warning: Patient also taking Aspirin'
    }
  ]);

  const handleProfileClick = () => {
    router.push('/patient-profile');
  };

  const handleRecordingToggle = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];
        
        recorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };
        
        recorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          // Process voice to text
          const result = await api.processVoiceToText(audioBlob);
          setTranscription(result.transcription || 'Voice processing completed');
          stream.getTracks().forEach(track => track.stop());
        };
        
        setMediaRecorder(recorder);
        setAudioChunks(chunks);
        recorder.start();
        setIsRecording(true);
        setTranscription('Listening... Speak your prescription now.');
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Unable to access microphone. Please check permissions.');
      }
    } else {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      setIsRecording(false);
    }
  };

  const handleSavePrescription = async () => {
    if (!selectedPatient || !transcription.trim()) {
      alert('Please select a patient and add prescription details.');
      return;
    }
    
    try {
      const prescriptionData = {
        patientId: selectedPatient,
        transcription: transcription,
        date: new Date().toISOString()
      };
      
      await api.createVoicePrescription(prescriptionData);
      alert('Prescription saved successfully!');
      setTranscription('');
      setSelectedPatient('');
      // Refresh prescriptions list
      fetchRecentPrescriptions();
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert('Failed to save prescription. Please try again.');
    }
  };

  const handleClearTranscription = () => {
    setTranscription('');
  };
  
  const fetchRecentPrescriptions = async () => {
    try {
      const result = await api.getVoicePrescriptions();
      if (result.prescriptions && result.prescriptions.length > 0) {
        setRecentPrescriptions(result.prescriptions);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };
  
  useEffect(() => {
    fetchRecentPrescriptions();
  }, []);

  return (
    <div className="min-h-screen bg-[#c8e6c9] flex">
      <Sidebar />
      
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 w-64 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-md transition-all duration-300"
            />
          </div>
          
          <button 
            onClick={handleProfileClick}
            className="flex items-center space-x-3 bg-[#4a7c59] px-6 py-3 rounded-full hover:bg-[#3d6b4a] transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="w-8 h-8 bg-[#a8d5ba] rounded-full"></div>
            <span className="text-white font-medium">{user?.name || 'Sam Cha'}</span>
          </button>
        </div>

        {/* Voice Prescription Section */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <Mic className="w-6 h-6 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Voice Prescription</h1>
              <p className="text-gray-600">Create prescriptions using voice-to-text technology</p>
            </div>
          </div>

          {/* Voice Prescription Input */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Mic className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Voice Prescription Input</span>
            </div>

            {/* Patient Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient</label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-all duration-300"
              >
                <option value="">Choose a patient...</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.patientId}
                  </option>
                ))}
              </select>
            </div>

            {/* Recording Button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={handleRecordingToggle}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </button>
            </div>
            <p className="text-center text-gray-500 text-sm mb-6">
              {isRecording ? 'Recording... Click to stop' : 'Click to start recording prescription'}
            </p>

            {/* Live Transcription */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Live Transcription</label>
              <div className="relative">
                <textarea
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  placeholder="Prescriptions will appear here as you speak..."
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-all duration-300"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-300">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-300">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleSavePrescription}
                className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save Prescription</span>
              </button>
              <button
                onClick={handleClearTranscription}
                className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Prescriptions</h2>
          
          <div className="space-y-4">
            {recentPrescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">
                        {prescription.patientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-800">{prescription.patientName}</h3>
                        <span className="text-sm text-gray-500">{prescription.patientId}</span>
                        {prescription.alert && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{prescription.date}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300 hover:scale-110">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Medication:</span>
                    <p className="font-medium text-gray-800">{prescription.medication}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Dosage:</span>
                    <p className="font-medium text-gray-800">{prescription.dosage}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Frequency:</span>
                    <p className="font-medium text-gray-800">{prescription.frequency}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <p className="font-medium text-gray-800">{prescription.duration}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-600">{prescription.notes}</p>
                </div>

                {prescription.alert && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-700">Drug interaction warning:</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">{prescription.alertMessage}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}