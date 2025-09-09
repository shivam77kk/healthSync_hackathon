"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Lock, Globe, HelpCircle, Star, Share2, Shield, ChevronRight } from "lucide-react"
import Sidebar from "@/components/dashboard/Sidebar"
import Header from "@/components/dashboard/Header"
import { userAPI } from "@/services/api"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [userProfile, setUserProfile] = useState({
    name: "Google User",
    age: "25",
    email: "user@gmail.com",
    gender: "male",
    bloodGroup: "O+"
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      setUserProfile({
        name: user.name || "Google User",
        age: user.age || "25",
        email: user.email || "user@gmail.com",
        gender: user.gender || "male",
        bloodGroup: user.bloodGroup || "O+"
      })
    }
  }, [])

  const saveProfile = () => {
    localStorage.setItem('user', JSON.stringify(userProfile))
    setIsEditing(false)
    alert("Profile updated successfully!")
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode")
    const savedLanguage = localStorage.getItem("language")
    if (savedTheme) setDarkMode(JSON.parse(savedTheme))
    if (savedLanguage) setLanguage(savedLanguage)
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem("darkMode", JSON.stringify(newMode))
    document.documentElement.classList.toggle("dark", newMode)
  }

  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    try {
      await userAPI.changePassword({ newPassword })
      alert("Password changed successfully!")
      setShowPasswordModal(false)
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      alert("Failed to change password")
    }
  }

  const shareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'HealthSync',
        text: 'Check out this amazing health management app!',
        url: window.location.origin
      })
    } else {
      navigator.clipboard.writeText(window.location.origin)
      alert("App link copied to clipboard!")
    }
  }

  const rateApp = () => {
    window.open("https://play.google.com/store", "_blank")
  }

  const helpTranslate = () => {
    window.open("mailto:translate@healthsync.com?subject=Help Translate HealthSync", "_blank")
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <Sidebar />
      <div className="ml-64">
        <Header />
        
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Settings</h1>
            
            {/* User Profile Section */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-6 mb-6`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Profile Information</h2>
                <button
                  onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-300'}`}
                    />
                  ) : (
                    <div className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {userProfile.name}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={userProfile.age}
                      onChange={(e) => setUserProfile({...userProfile, age: e.target.value})}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-300'}`}
                    />
                  ) : (
                    <div className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {userProfile.age} years
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-300'}`}
                    />
                  ) : (
                    <div className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {userProfile.email}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Gender</label>
                  {isEditing ? (
                    <select
                      value={userProfile.gender}
                      onChange={(e) => setUserProfile({...userProfile, gender: e.target.value})}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-300'}`}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <div className={`w-full p-3 rounded-lg border capitalize ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {userProfile.gender}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Blood Group</label>
                  {isEditing ? (
                    <select
                      value={userProfile.bloodGroup}
                      onChange={(e) => setUserProfile({...userProfile, bloodGroup: e.target.value})}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-300'}`}
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <div className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {userProfile.bloodGroup}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className={`w-full p-3 text-left rounded-lg border transition-all hover:shadow-md ${darkMode ? 'bg-blue-900 text-blue-300 border-blue-700 hover:bg-blue-800' : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'}`}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-xl p-6 space-y-6`}>
              
              {/* Dark Theme */}
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                  <div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dark Theme</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Switch between light and dark mode</p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Change Password */}
              <div 
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-red-500" />
                  <div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Change Password</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Update your account password</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>

              {/* Language */}
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-green-500" />
                  <div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Language</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Choose your preferred language</p>
                  </div>
                </div>
                <select 
                  value={language} 
                  onChange={(e) => changeLanguage(e.target.value)}
                  className={`px-3 py-1 rounded border ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="hi">हिंदी</option>
                </select>
              </div>

              {/* Help Translate */}
              <div 
                onClick={helpTranslate}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-purple-500" />
                  <div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Help Us Translate</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Contribute to app translations</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>

              {/* Rate Us */}
              <div 
                onClick={rateApp}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Rate Us on Google Play</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Help us improve with your feedback</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>

              {/* Share with Friends */}
              <div 
                onClick={shareApp}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Share with Friends</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Invite friends to use HealthSync</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>

              {/* Privacy */}
              <div 
                onClick={() => setShowPrivacyModal(true)}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  <div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Privacy Policy</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>View our privacy policy</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg w-96`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Change Password</h3>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full p-3 border rounded mb-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-3 border rounded mb-4 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
            />
            <div className="flex gap-3">
              <button onClick={changePassword} className="flex-1 bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
                Change
              </button>
              <button onClick={() => setShowPasswordModal(false)} className="flex-1 bg-gray-300 text-gray-700 p-3 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg w-96 max-h-96 overflow-y-auto`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Privacy Policy</h3>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-3`}>
              <p>We respect your privacy and are committed to protecting your personal data.</p>
              <p>• We collect only necessary health information to provide our services</p>
              <p>• Your data is encrypted and stored securely</p>
              <p>• We never share your personal information with third parties</p>
              <p>• You can delete your account and data at any time</p>
              <p>• We comply with healthcare privacy regulations</p>
            </div>
            <button 
              onClick={() => setShowPrivacyModal(false)} 
              className="w-full mt-4 bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}