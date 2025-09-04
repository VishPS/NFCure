"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import {
  Scan,
  CheckCircle,
  AlertTriangle,
  User,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  X,
  ArrowRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/utils"
import HistoricalAnalysisModal from "./historical-analysis-modal"

interface NFCScannerModalProps {
  isOpen: boolean
  onClose: () => void
}

// Animated Radar Scanner Component
function RadarScanner({ isScanning, isComplete }: { isScanning: boolean; isComplete: boolean }) {
  return (
    <div className="relative w-48 h-48 mx-auto mb-6">
      {/* Outer Ring */}
      <div
        className={`absolute inset-0 rounded-full border-2 border-primary/30 ${
          isScanning ? "animate-ping" : ""
        } transition-all duration-1000`}
      />

      {/* Middle Ring */}
      <div
        className={`absolute inset-4 rounded-full border-2 border-primary/50 ${
          isScanning ? "animate-pulse" : ""
        } transition-all duration-1000`}
        style={{ animationDelay: "0.5s" }}
      />

      {/* Inner Ring */}
      <div
        className={`absolute inset-8 rounded-full border-2 ${
          isComplete ? "border-secondary bg-secondary/20" : "border-primary"
        } ${isScanning ? "animate-pulse" : ""} transition-all duration-1000`}
        style={{ animationDelay: "1s" }}
      />

      {/* Center Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isComplete ? (
          <CheckCircle className="h-12 w-12 text-secondary animate-bounce" />
        ) : (
          <Scan className={`h-12 w-12 text-primary ${isScanning ? "animate-spin" : ""}`} />
        )}
      </div>

      {/* Scanning Lines */}
      {isScanning && (
        <>
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
          <div className="absolute left-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-primary to-transparent animate-pulse" />
        </>
      )}

      {/* Radar Sweep */}
      {isScanning && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute top-1/2 left-1/2 w-24 h-0.5 bg-gradient-to-r from-primary to-transparent origin-left animate-spin" />
        </div>
      )}
    </div>
  )
}

// Patient Card Drop Animation
function PatientCard({ patient, delay }: { patient: any; delay: number }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <Card
      className={`medical-glow transition-all duration-1000 transform ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
          </div>
          <Badge variant="secondary" className="ml-auto">
            Authenticated
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2 bg-card/50 rounded">
            <Heart className="h-4 w-4 text-destructive" />
            <span className="text-sm">{patient.vitals.heartRate} BPM</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-card/50 rounded">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-sm">{patient.vitals.bloodPressure}</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-card/50 rounded">
            <Thermometer className="h-4 w-4 text-chart-4" />
            <span className="text-sm">{patient.vitals.temperature}°F</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-card/50 rounded">
            <Droplets className="h-4 w-4 text-secondary" />
            <span className="text-sm">{patient.vitals.oxygenSat}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function NFCScannerModal({ isOpen, onClose }: NFCScannerModalProps) {
  const [scanningState, setScanningState] = useState<'idle' | 'scanning' | 'authenticating' | 'complete' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [detectedPatient, setDetectedPatient] = useState<any>(null)
  const [showHistoricalAnalysis, setShowHistoricalAnalysis] = useState(false)
  const router = useRouter()

  const startScan = () => {
    setScanningState("scanning")
    setProgress(0)

    // Simulate scanning progress
    const scanInterval = setInterval(() => {
      setProgress((prev: number) => {
        if (prev >= 100) {
          clearInterval(scanInterval)
          setScanningState("authenticating")

          // Simulate authentication and data fetch
          setTimeout(async () => {
            try {
              // In a real app, you'd get the ID from the NFC scan
              const scannedId = "P-2024-001"
              
              const { data: patient, error } = await supabase
                .from('patients')
                .select('*')
                .eq('nfc_id', scannedId)
                .single()

              let detectedPatientData;

              if (patient && !error) {
                // Use real patient data from database
                detectedPatientData = {
                  id: patient.nfc_id,
                  name: patient.name,
                  age: patient.age || 45,
                  gender: patient.gender || "Male",
                  vitals: {
                    heartRate: patient.heart_rate || "72 bpm",
                    bloodPressure: patient.blood_pressure || "120/80 mmHg",
                    temperature: patient.temperature || "98.6°F",
                    oxygenSat: patient.oxygen_saturation || "98"
                  }
                }
              } else {
                // Fallback to mock patient if database fails
                console.log("Using mock patient data - database error:", error)
                detectedPatientData = {
                  id: "P001",
                  name: "John Doe",
                  age: 45,
                  gender: "Male",
                  vitals: {
                    heartRate: "72 bpm",
                    bloodPressure: "120/80 mmHg",
                    temperature: "98.6°F",
                    oxygenSat: "98"
                  }
                }
              }
              
              // Set detected patient
              setDetectedPatient(detectedPatientData)
              
              // Show historical analysis modal immediately after patient detection - BLOCKING
              console.log("🔍 Triggering historical analysis modal for patient:", detectedPatientData.id)
              setShowHistoricalAnalysis(true)
              // Don't set scanning state to complete until historical analysis is done
              
            } catch (error) {
              console.error("Error during patient detection:", error)
              setScanningState("error")
            }
          }, 1500)

          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }

  const handleProceedToDiagnosis = () => {
    if (detectedPatient) {
      router.push(`/diagnosis?patientId=${detectedPatient.id}&patientName=${encodeURIComponent(detectedPatient.name)}`)
    }
    onClose()
  }

  const handleViewDashboard = () => {
    // Only allow dashboard access after historical analysis is completed
    if (showHistoricalAnalysis) {
      // Historical analysis still pending - don't allow dashboard access
      return
    }
    
    onClose()
    if (detectedPatient) {
      router.push(`/patient?id=${detectedPatient.id}`)
    }
  }

  const handleHistoricalAnalysisComplete = () => {
    // Close historical analysis and show patient detected screen
    setShowHistoricalAnalysis(false)
    setScanningState("complete")
  }

  const handleClose = () => {
    setScanningState("idle")
    setProgress(0)
    setDetectedPatient(null)
    setShowHistoricalAnalysis(false)
    onClose()
  }

  const renderScanningContent = () => {
    // Hide main scanning content when historical analysis is showing
    if (showHistoricalAnalysis) {
      return (
        <div className="text-center py-8">
          <RadarScanner isScanning={false} isComplete={true} />
          <h3 className="text-xl font-semibold mb-2 text-amber-600">⚠️ Historical Analysis Required</h3>
          <p className="text-muted-foreground mb-4">
            Please review the patient's medical history analysis before proceeding
          </p>
        </div>
      )
    }

    switch (scanningState) {
      case "idle":
        return (
          <div className="text-center py-8">
            <RadarScanner isScanning={false} isComplete={false} />
            <h3 className="text-xl font-semibold mb-2">NFC Patient Scanner</h3>
            <p className="text-muted-foreground mb-6">
              Place your NFC-enabled device near the patient's medical tag to begin scanning
            </p>
            <Button onClick={startScan} className="medical-glow pulse-animation" size="lg">
              <Scan className="mr-2 h-5 w-5" />
              Start NFC Scan
            </Button>
          </div>
        )

      case "scanning":
        return (
          <div className="text-center py-8">
            <RadarScanner isScanning={true} isComplete={false} />
            <h3 className="text-xl font-semibold mb-2">Scanning for NFC Tag...</h3>
            <p className="text-muted-foreground mb-4">Keep device steady and close to the medical tag</p>
            <div className="space-y-2 max-w-xs mx-auto">
              <div className="flex justify-between text-sm">
                <span>Scan Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        )

      case "authenticating":
        return (
          <div className="text-center py-8">
            <RadarScanner isScanning={true} isComplete={false} />
            <h3 className="text-xl font-semibold mb-2">Authenticating Patient...</h3>
            <p className="text-muted-foreground mb-4">Verifying medical credentials and access permissions</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        )

      case "complete":
        return (
          <div className="text-center py-8">
            <RadarScanner isScanning={false} isComplete={true} />
            <h3 className="text-xl font-semibold mb-2 text-secondary">Patient Authenticated!</h3>
            <p className="text-muted-foreground mb-6">Successfully connected to patient medical records</p>

            {detectedPatient && (
              <div className="mb-6">
                <PatientCard patient={detectedPatient} delay={500} />
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={handleViewDashboard} className="medical-glow-green" size="lg">
                <ArrowRight className="mr-2 h-5 w-5" />
                View Dashboard
              </Button>
              <Button variant="outline" onClick={handleClose} size="lg">
                Close
              </Button>
            </div>
          </div>
        )

      case "error":
        return (
          <div className="text-center py-8">
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-destructive">Scan Failed</h3>
            <p className="text-muted-foreground mb-6">
              Unable to detect NFC tag. Please ensure the device is close to the medical tag and try again.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setScanningState("idle")} className="medical-glow" size="lg">
                Try Again
              </Button>
              <Button variant="outline" onClick={handleClose} size="lg">
                Cancel
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md medical-glow">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5 text-primary" />
              NFC Medical Scanner
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-4">{renderScanningContent()}</div>

        {scanningState !== "idle" && scanningState !== "complete" && (
          <div className="text-center">
            <Button variant="ghost" onClick={handleClose} size="sm">
              Cancel Scan
            </Button>
          </div>
        )}
      </DialogContent>

      {/* Historical Analysis Modal - BLOCKING */}
      {detectedPatient && (
        <HistoricalAnalysisModal
          isOpen={showHistoricalAnalysis}
          onClose={handleHistoricalAnalysisComplete}
          patientId={detectedPatient.id}
          patientName={detectedPatient.name}
          onProceedToDiagnosis={handleProceedToDiagnosis}
        />
      )}
    </Dialog>
  )
}

export default NFCScannerModal
