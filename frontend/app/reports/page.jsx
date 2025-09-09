"use client"

import { useState, useRef } from "react"
import { Upload, FileText, Image, File, X, Download, Eye, Trash2 } from "lucide-react"
import Sidebar from "../components/dashboard/Sidebar"
import Header from "../components/dashboard/Header"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function ReportsPage() {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const getFileIcon = (type) => {
    if (type.includes('image')) return <Image className="w-6 h-6 text-blue-500" />
    if (type.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />
    return <File className="w-6 h-6 text-gray-500" />
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFileUpload(files)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    handleFileUpload(files)
  }

  const handleFileUpload = (files) => {
    setIsUploading(true)
    
    files.forEach((file) => {
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type || 'unknown',
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        uploadDate: new Date().toISOString().split('T')[0],
        category: getCategoryFromType(file.type)
      }
      
      setTimeout(() => {
        setUploadedFiles(prev => [...prev, newFile])
        setIsUploading(false)
      }, 1000)
    })
  }

  const getCategoryFromType = (type) => {
    if (type.includes('image')) return 'Imaging'
    if (type.includes('pdf')) return 'Lab Reports'
    if (type.includes('presentation')) return 'Presentations'
    return 'Documents'
  }

  const deleteFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id))
  }

  const categories = ['All', 'Lab Reports', 'Imaging', 'Prescriptions', 'Documents', 'Presentations']
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredFiles = selectedCategory === 'All' 
    ? uploadedFiles 
    : uploadedFiles.filter(file => file.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <div className="ml-64 p-6">
        <Header />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reports & Records</h1>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>

          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
            <CardContent className="p-8">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`text-center cursor-pointer transition-all duration-300 ${
                  isDragging 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                } p-8 rounded-lg border-2 border-dashed ${
                  isDragging ? 'border-blue-400' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${
                  isDragging ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
                }`} />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {isDragging ? 'Drop files here' : 'Upload Medical Documents'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Supports: PDF, PNG, JPG, JPEG, DOC, DOCX, PPT, PPTX (Max 10MB)
                </p>
                {isUploading && (
                  <div className="mt-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-blue-600 dark:text-blue-400 mt-2">Uploading...</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.ppt,.pptx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </CardContent>
          </Card>



          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Uploaded Documents ({filteredFiles.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No documents uploaded yet
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white">{file.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {file.category} • {file.size} • {file.uploadDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="hover:bg-blue-100 dark:hover:bg-blue-900/20">
                          <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-green-100 dark:hover:bg-green-900/20">
                          <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteFile(file.id)}
                          className="hover:bg-red-100 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}