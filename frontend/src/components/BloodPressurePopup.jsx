import { useState } from 'react';
import { X } from 'lucide-react';

export default function BloodPressurePopup({ isOpen, onClose, onSave }) {
  const [bloodPressure, setBloodPressure] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSave = () => {
    if (bloodPressure && date && time) {
      onSave({ bloodPressure, date, time });
      setBloodPressure('');
      setDate('');
      setTime('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#c8e6c9] rounded-2xl p-6 w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-6">Blood Pressure</h2>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter blood pressure"
              value={bloodPressure}
              onChange={(e) => setBloodPressure(e.target.value)}
              className="w-full px-4 py-3 bg-gray-200 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-200 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 bg-gray-200 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-300 mt-6"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}