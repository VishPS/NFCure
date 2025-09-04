'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { testDatabaseConnection, checkDatabaseTables } from "@/lib/database-test"
import { Database, CheckCircle, XCircle, RefreshCw, AlertTriangle } from "lucide-react"

interface ConnectionStatus {
  connected: boolean
  error?: string
  message?: string
  patientCount?: number | any
  details?: any
}

interface TableStatus {
  patients?: {
    exists: boolean
    error?: string
    sampleData?: any
  }
  error?: string
  details?: any
}

export default function DatabaseStatusPage() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null)
  const [tableStatus, setTableStatus] = useState<TableStatus | null>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const connResult = await testDatabaseConnection()
      setConnectionStatus(connResult as ConnectionStatus)
      
      if (connResult.connected) {
        const tableResult = await checkDatabaseTables()
        setTableStatus(tableResult as TableStatus)
      }
    } catch (error) {
      setConnectionStatus({
        connected: false,
        error: 'Failed to test connection',
        details: error
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Database Connection Status</h1>
        <p className="text-muted-foreground">Check the status of your Supabase database connection</p>
      </div>

      <div className="space-y-6">
        {/* Connection Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Supabase Connection
            </CardTitle>
            <CardDescription>
              Current database connection status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {connectionStatus?.connected ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : connectionStatus?.connected === false ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className="font-medium">
                    {connectionStatus?.connected ? 'Connected' : 
                     connectionStatus?.connected === false ? 'Disconnected' : 'Testing...'}
                  </span>
                </div>
                <Badge variant={connectionStatus?.connected ? 'default' : 'destructive'}>
                  {connectionStatus?.connected ? 'Online' : 'Offline'}
                </Badge>
              </div>

              {connectionStatus?.message && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">{connectionStatus.message}</p>
                </div>
              )}

              {connectionStatus?.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm font-medium">Error:</p>
                  <p className="text-red-700 text-sm">{connectionStatus.error}</p>
                </div>
              )}

              <Button 
                onClick={testConnection} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Test Connection
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Database Tables Status */}
        {connectionStatus?.connected && tableStatus && (
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>Status of database tables and schema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Patients Table */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {tableStatus.patients?.exists ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">Patients Table</span>
                  </div>
                  <Badge variant={tableStatus.patients?.exists ? 'default' : 'destructive'}>
                    {tableStatus.patients?.exists ? 'Available' : 'Missing'}
                  </Badge>
                </div>

                {tableStatus.patients?.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm font-medium">Patients Table Error:</p>
                    <p className="text-red-700 text-sm">{tableStatus.patients.error}</p>
                  </div>
                )}

                {tableStatus.patients?.sampleData && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm font-medium mb-2">Sample Data Structure:</p>
                    <pre className="text-xs text-blue-700 overflow-x-auto">
                      {JSON.stringify(tableStatus.patients.sampleData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Database Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Current database configuration details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Database Type:</span>
                <span className="font-medium">Supabase (PostgreSQL)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">URL:</span>
                <span className="font-mono text-xs">https://bxdlohychhjnsngqfkho.supabase.co</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Client Library:</span>
                <span className="font-medium">@supabase/supabase-js v2.57.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
