"use client"

import { useState } from 'react'
import { api } from '@/lib/api'
import { Button } from './ui/Button'

export default function ConnectionTest() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setStatus('Testing connection...')
    
    try {
      const result = await api.testConnection()
      setStatus(`✅ Connection successful! ${result.message}`)
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Backend Connection Test</h3>
      <Button 
        onClick={testConnection} 
        disabled={loading}
        className="mb-2"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </Button>
      {status && (
        <p className={`text-sm ${status.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {status}
        </p>
      )}
    </div>
  )
}