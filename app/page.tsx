"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Suspense, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Activity, Thermometer, Droplets, Zap, Scan, Brain, Stethoscope, AlertTriangle, CheckCircle } from "lucide-react"
import type * as THREE from "three"
import { NFCScannerModal } from "@/components/nfc-scanner-modal"
import { akashAPI, MedicalData } from "@/lib/akash-api"

// 3D Human Skeleton Model Component
function HumanModel() {
  const meshRef = useRef<THREE.Mesh>(null)

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      {/* Skull */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      {/* Jaw */}
      <mesh position={[0, 1.35, 0.15]}>
        <boxGeometry args={[0.25, 0.1, 0.15]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      {/* Cervical Spine */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      {/* Thoracic Spine */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      {/* Lumbar Spine */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      {/* Rib Cage */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 12]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.6} wireframe />
      </mesh>

      {/* Sternum */}
      <mesh position={[0, 0.8, 0.25]}>
        <boxGeometry args={[0.05, 0.8, 0.1]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      {/* Clavicles */}
      <mesh position={[-0.2, 1.0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      <mesh position={[0.2, 1.0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      {/* Scapulae */}
      <mesh position={[-0.4, 0.6, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.15, 0.2, 0.05]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      <mesh position={[0.4, 0.6, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.15, 0.2, 0.05]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      {/* Humerus (Upper Arms) */}
      <mesh position={[-0.6, 0.2, 0]} rotation={[0, 0, Math.PI / 8]}>
        <cylinderGeometry args={[0.04, 0.06, 0.8, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      <mesh position={[0.6, 0.2, 0]} rotation={[0, 0, -Math.PI / 8]}>
        <cylinderGeometry args={[0.04, 0.06, 0.8, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      {/* Radius and Ulna (Forearms) */}
      <mesh position={[-0.9, -0.3, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.03, 0.04, 0.7, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      <mesh position={[-0.95, -0.3, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.025, 0.035, 0.7, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      <mesh position={[0.9, -0.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.03, 0.04, 0.7, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      <mesh position={[0.95, -0.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.025, 0.035, 0.7, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      {/* Hands */}
      <mesh position={[-1.1, -0.6, 0]}>
        <boxGeometry args={[0.1, 0.15, 0.05]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      <mesh position={[1.1, -0.6, 0]}>
        <boxGeometry args={[0.1, 0.15, 0.05]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      {/* Pelvis */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.25, 0.2, 0.4, 12]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      {/* Femur (Thigh Bones) */}
      <mesh position={[-0.1, -1.0, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 1.0, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      <mesh position={[0.1, -1.0, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 1.0, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      {/* Patella (Kneecaps) */}
      <mesh position={[-0.1, -1.5, 0.05]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      <mesh position={[0.1, -1.5, 0.05]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      {/* Tibia and Fibula (Lower Legs) */}
      <mesh position={[-0.1, -1.8, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.8, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      <mesh position={[-0.12, -1.8, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 0.8, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      <mesh position={[0.1, -1.8, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.8, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      <mesh position={[0.12, -1.8, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 0.8, 8]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.1, -2.3, 0.1]}>
        <boxGeometry args={[0.08, 0.15, 0.25]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      <mesh position={[0.1, -2.3, 0.1]}>
        <boxGeometry args={[0.08, 0.15, 0.25]} />
        <meshStandardMaterial color="#f5f5dc" transparent opacity={0.8} />
      </mesh>

      {/* Highlighted Heart */}
      <mesh position={[-0.1, 0.3, 0.2]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ff4d4d" transparent opacity={0.7} />
      </mesh>

      {/* Highlighted Brain */}
      <mesh position={[0, 1.5, 0.1]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#00bfae" transparent opacity={0.6} />
      </mesh>
    </Float>
  )
}

// Vital Statistics Card Component
function VitalCard({
  icon: Icon,
  label,
  value,
  unit,
  status,
  position,
}: {
  icon: any
  label: string
  value: string
  unit: string
  status: "normal" | "warning" | "critical"
  position: [number, number, number]
}) {
  const statusColors = {
    normal: "bg-secondary/20 border-secondary",
    warning: "bg-chart-4/20 border-chart-4",
    critical: "bg-destructive/20 border-destructive",
  }

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 float-animation hidden md:block`}
      style={{
        left: `${50 + position[0] * 20}%`,
        top: `${50 + position[1] * 20}%`,
        animationDelay: `${position[2]}s`,
      }}
    >
      <Card className={`w-40 ${statusColors[status]} medical-glow backdrop-blur-sm`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{value}</span>
                <span className="text-sm text-muted-foreground">{unit}</span>
              </div>
            </div>
          </div>
          <Badge
            variant={status === "normal" ? "secondary" : status === "warning" ? "outline" : "destructive"}
            className="mt-2"
          >
            {status.toUpperCase()}
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LandingPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [showNFCModal, setShowNFCModal] = useState(false)
  const [showDiagnosis, setShowDiagnosis] = useState(false)
  const [diagnosisResult, setDiagnosisResult] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [proposedOperation, setProposedOperation] = useState("")

  const vitalStats = [
    { icon: Heart, label: "Heart Rate", value: "72", unit: "BPM", status: "normal" as const, position: [-1.8, -1.2, 0] as [number, number, number] },
    { icon: Zap, label: "Energy Level", value: "85", unit: "%", status: "normal" as const, position: [-1.8, -1.8, 0.2] as [number, number, number] },
    {
      icon: Activity,
      label: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      status: "normal" as const,
      position: [1.8, -1.2, 0.5] as [number, number, number],
    },
    {
      icon: Thermometer,
      label: "Temperature",
      value: "98.6",
      unit: "°F",
      status: "normal" as const,
      position: [-1.8, 1.2, 1] as [number, number, number],
    },
    {
      icon: Droplets,
      label: "Blood Sugar",
      value: "95",
      unit: "mg/dL",
      status: "normal" as const,
      position: [1.8, 1.2, 1.5] as [number, number, number],
    },
  ]

  // Function to analyze vitals using Akash Chat API
  const analyzeVitals = async () => {
    if (!proposedOperation.trim()) {
      alert("Please enter a proposed operation or procedure")
      return
    }

    setIsAnalyzing(true)
    setDiagnosisResult("")

    try {
      // Collect ALL patient data from the website for comprehensive analysis
      const medicalData = {
        // Current Vital Signs (from floating cards)
        heartRate: "72 BPM",
        bloodPressure: "120/80 mmHg", 
        temperature: "98.6°F",
        bloodSugar: "95 mg/dL",
        energyLevel: "85%",
        
        // Patient Demographics
        patientId: "P-2024-001",
        patientName: "John Doe",
        age: 45,
        gender: "Male",
        
        // Medical History (from patient dashboard)
        medicalHistory: [
          {
            date: "2024-01-15",
            type: "Surgery",
            description: "Appendectomy",
            doctor: "Dr. Smith",
            status: "Completed",
            severity: "moderate"
          },
          {
            date: "2023-11-22",
            type: "Diagnosis",
            description: "Hypertension",
            doctor: "Dr. Johnson",
            status: "Ongoing",
            severity: "low"
          },
          {
            date: "2023-08-10",
            type: "Injury",
            description: "Fractured wrist",
            doctor: "Dr. Brown",
            status: "Healed",
            severity: "moderate"
          },
          {
            date: "2023-03-05",
            type: "Checkup",
            description: "Annual physical examination",
            doctor: "Dr. Johnson",
            status: "Completed",
            severity: "low"
          }
        ],
        
        // Current Medications (from patient dashboard)
        medications: [
          {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            startDate: "2023-11-22",
            status: "Active",
            purpose: "Blood pressure control"
          },
          {
            name: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
            startDate: "2023-08-15",
            status: "Active",
            purpose: "Diabetes management"
          },
          {
            name: "Ibuprofen",
            dosage: "200mg",
            frequency: "As needed",
            startDate: "2024-01-10",
            status: "Discontinued",
            purpose: "Pain relief"
          }
        ],
        
        // Lab Results (from patient dashboard)
        labResults: [
          {
            id: "LAB-2024-001",
            date: "2024-06-15",
            type: "Complete Blood Count",
            status: "Normal",
            doctor: "Dr. Wilson"
          },
          {
            id: "LAB-2024-002",
            date: "2024-05-20",
            type: "Lipid Panel",
            status: "Abnormal",
            doctor: "Dr. Johnson"
          },
          {
            id: "LAB-2024-003",
            date: "2024-04-10",
            type: "Thyroid Function",
            status: "Normal",
            doctor: "Dr. Smith"
          }
        ],
        
        // Blood Work Values (from patient dashboard)
        bloodWork: [
          { test: "Cholesterol", value: 180, normal: "< 200", status: "normal" },
          { test: "Glucose", value: 95, normal: "70-100", status: "normal" },
          { test: "Hemoglobin", value: 14.2, normal: "12-16", status: "normal" },
          { test: "White Blood Cells", value: 7.5, normal: "4-11", status: "normal" }
        ],
        
        // Proposed Operation
        proposedOperation: proposedOperation
      }

      // Use real Akash API for medical analysis
      let result
      try {
        result = await akashAPI.analyzeMedicalData(medicalData)
      } catch (apiError) {
        console.warn('Akash API failed, using simulation:', apiError)
        // Fallback to simulation if API fails
        result = await akashAPI.simulateAnalysis(medicalData)
      }

      setDiagnosisResult(result)
      setShowDiagnosis(true)
    } catch (error) {
      console.error('Analysis error:', error)
      setDiagnosisResult("Error analyzing vitals. Please try again.")
      setShowDiagnosis(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background grid-pattern relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center medical-glow">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Digital Twin Medical</h1>
          </div>

          <nav className="flex items-center gap-6">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Patients
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Analytics
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-6xl font-bold text-balance mb-6">
              Your Health, Your <span className="text-primary medical-glow">Digital Twin</span>
              <br />
              Always with You.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Experience the future of healthcare with real-time monitoring, AI-powered insights, and personalized
              medical simulations.
            </p>
          </div>

          {/* 3D Scene Container */}
          <div className="relative h-[450px] w-full mb-12">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#0d74ff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00bfae" />

                <HumanModel />

                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
                <Environment preset="night" />
              </Suspense>
            </Canvas>

            {/* Floating Vital Statistics */}
            {vitalStats.map((stat, index) => (
              <VitalCard key={index} {...stat} />
            ))}
          </div>

          {/* Mobile Vital Statistics Grid */}
          <div className="md:hidden grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
            {vitalStats.map((stat, index) => {
              const Icon = stat.icon
              const statusColors = {
                normal: "bg-secondary/20 border-secondary",
                warning: "bg-chart-4/20 border-chart-4",
                critical: "bg-destructive/20 border-destructive",
              }
              
              return (
                <Card key={index} className={`${statusColors[stat.status]} medical-glow backdrop-blur-sm`}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-foreground">{stat.value}</span>
                          <span className="text-xs text-muted-foreground">{stat.unit}</span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={stat.status === "normal" ? "secondary" : stat.status === "warning" ? "outline" : "destructive"}
                      className="mt-1 text-xs"
                    >
                      {stat.status.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-6 mb-12">
            <Button
              size="lg"
              className="px-8 py-4 text-lg medical-glow pulse-animation"
              onClick={() => setShowNFCModal(true)}
            >
              <Scan className="mr-2 h-5 w-5" />
              Scan NFC
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground medical-glow-green bg-transparent"
            >
              Explore Digital Twin
            </Button>
          </div>

          {/* AI Diagnosis Section */}
          <div className="max-w-4xl mx-auto">
            <Card className="medical-glow">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center medical-glow">
                      <Brain className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">AI Medical Diagnosis</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Powered by Akash Network's advanced AI models to analyze ALL patient data including vital signs, medical history, medications, lab results, and provide comprehensive surgical risk assessment
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Data Summary */}
                  <div className="bg-card/30 border border-border/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-foreground mb-3">Patient Data Being Analyzed:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Heart className="h-3 w-3 text-destructive" />
                        <span>Vital Signs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-3 w-3 text-primary" />
                        <span>Medical History</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain className="h-3 w-3 text-secondary" />
                        <span>Medications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-3 w-3 text-chart-4" />
                        <span>Lab Results</span>
                      </div>
                    </div>
                  </div>

                  {/* Operation Input */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Proposed Operation/Procedure
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Cardiac bypass surgery, Appendectomy, Knee replacement..."
                      value={proposedOperation}
                      onChange={(e) => setProposedOperation(e.target.value)}
                      className="w-full px-4 py-3 bg-input border border-border/50 rounded-lg focus:border-primary focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Analyze Button */}
                  <div className="text-center">
                    <Button
                      onClick={analyzeVitals}
                      disabled={isAnalyzing || !proposedOperation.trim()}
                      size="lg"
                      className="px-8 py-4 text-lg medical-glow-green"
                    >
                      {isAnalyzing ? (
                        <>
                          <Brain className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing with AI...
                        </>
                      ) : (
                        <>
                          <Stethoscope className="mr-2 h-5 w-5" />
                          Analyze Surgical Risk
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Diagnosis Results */}
                  {showDiagnosis && diagnosisResult && (
                    <div className="mt-8">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-secondary" />
                        <h4 className="text-lg font-semibold text-foreground">AI Diagnosis Results</h4>
                      </div>
                      <div className="bg-card/50 border border-border/50 rounded-lg p-6">
                        <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                          {diagnosisResult}
                        </pre>
                      </div>
                      <div className="mt-4 text-center">
                        <Button
                          variant="outline"
                          onClick={() => setShowDiagnosis(false)}
                          className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                        >
                          Close Results
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* NFC Scanner Modal */}
      <NFCScannerModal isOpen={showNFCModal} onClose={() => setShowNFCModal(false)} />
    </div>
  )
}
