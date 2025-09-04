"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Activity,
  Heart,
  Pill,
  TrendingUp,
  User,
  ArrowLeft,
  Download,
  Eye,
  Scan,
  Stethoscope,
  ClipboardList,
  TestTube,
  Shield,
  Brain,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import NFCScannerModal from "@/components/nfc-scanner-modal"
import { akashAPI, MedicalData } from "@/lib/akash-api"
import { useEffect } from "react"

// Sidebar Navigation Component
function PatientSidebar({
  activeSection,
  onSectionChange,
}: { activeSection: string; onSectionChange: (section: string) => void }) {
  const navigationItems = [
    { id: "vitals", label: "Vitals", icon: Activity },
    { id: "history", label: "History", icon: ClipboardList },
    { id: "surgeries", label: "Surgeries", icon: Heart },
    { id: "medications", label: "Medications", icon: Pill },
    { id: "lab-reports", label: "Lab Reports", icon: TestTube },
    { id: "diagnosis", label: "Diagnosis", icon: Stethoscope },
  ]

  return (
    <div className="w-64 bg-card/50 backdrop-blur-sm border-r border-border/50 h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center medical-glow">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">John Doe</h2>
            <p className="text-sm text-muted-foreground">Patient ID: P-2024-001</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive ? "medical-glow bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

// Vitals Section Component
function VitalsSection() {
  const vitalTrends = [
    { date: "Jan", heartRate: 72, bloodPressure: 120, temperature: 98.6 },
    { date: "Feb", heartRate: 75, bloodPressure: 118, temperature: 98.4 },
    { date: "Mar", heartRate: 70, bloodPressure: 122, temperature: 98.7 },
    { date: "Apr", heartRate: 73, bloodPressure: 119, temperature: 98.5 },
    { date: "May", heartRate: 71, bloodPressure: 121, temperature: 98.6 },
    { date: "Jun", heartRate: 74, bloodPressure: 117, temperature: 98.3 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="medical-glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Heart Rate</p>
                <p className="text-2xl font-bold">72 BPM</p>
                <Badge variant="secondary" className="mt-1">
                  Normal
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="medical-glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Blood Pressure</p>
                <p className="text-2xl font-bold">120/80</p>
                <Badge variant="secondary" className="mt-1">
                  Normal
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="medical-glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-2xl font-bold">98.6°F</p>
                <Badge variant="secondary" className="mt-1">
                  Normal
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="medical-glow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-chart-4" />
              <div>
                <p className="text-sm text-muted-foreground">O2 Saturation</p>
                <p className="text-2xl font-bold">98%</p>
                <Badge variant="secondary" className="mt-1">
                  Normal
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="medical-glow-green">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-secondary" />
            Vital Signs Trends (6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={vitalTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0 / 0.3)" />
              <XAxis dataKey="date" stroke="oklch(0.708 0 0)" />
              <YAxis stroke="oklch(0.708 0 0)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.17 0 0)",
                  border: "1px solid oklch(0.25 0 0 / 0.3)",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="heartRate"
                stroke="oklch(0.577 0.245 27.325)"
                strokeWidth={2}
                name="Heart Rate"
              />
              <Line
                type="monotone"
                dataKey="bloodPressure"
                stroke="oklch(0.55 0.25 250)"
                strokeWidth={2}
                name="Blood Pressure"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

// Medical History Section
function HistorySection() {
  const medicalHistory = [
    {
      date: "2024-01-15",
      type: "Surgery",
      description: "Appendectomy",
      doctor: "Dr. Smith",
      status: "Completed",
      severity: "moderate",
    },
    {
      date: "2023-11-22",
      type: "Diagnosis",
      description: "Hypertension",
      doctor: "Dr. Johnson",
      status: "Ongoing",
      severity: "low",
    },
    {
      date: "2023-08-10",
      type: "Injury",
      description: "Fractured wrist",
      doctor: "Dr. Brown",
      status: "Healed",
      severity: "moderate",
    },
    {
      date: "2023-03-05",
      type: "Checkup",
      description: "Annual physical examination",
      doctor: "Dr. Johnson",
      status: "Completed",
      severity: "low",
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="medical-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Medical History Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {medicalHistory.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 bg-card/50 rounded-lg border border-border/50">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-3 h-3 rounded-full mt-2 ${
                        item.severity === "high"
                          ? "bg-destructive"
                          : item.severity === "moderate"
                            ? "bg-chart-4"
                            : "bg-secondary"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{item.description}</h4>
                      <Badge variant={item.status === "Ongoing" ? "outline" : "secondary"}>{item.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {item.type} • {item.doctor}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

// Medications Section
function MedicationsSection() {
  const medications = [
    {
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: "2023-11-22",
      status: "Active",
      purpose: "Blood pressure control",
    },
    {
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      startDate: "2023-08-15",
      status: "Active",
      purpose: "Diabetes management",
    },
    {
      name: "Ibuprofen",
      dosage: "200mg",
      frequency: "As needed",
      startDate: "2024-01-10",
      status: "Discontinued",
      purpose: "Pain relief",
    },
  ]

  const adherenceData = [
    { month: "Jan", adherence: 95 },
    { month: "Feb", adherence: 88 },
    { month: "Mar", adherence: 92 },
    { month: "Apr", adherence: 97 },
    { month: "May", adherence: 89 },
    { month: "Jun", adherence: 94 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="medical-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              Current Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medications.map((med, index) => (
                <div key={index} className="p-4 bg-card/50 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{med.name}</h4>
                    <Badge variant={med.status === "Active" ? "secondary" : "outline"}>{med.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {med.dosage} • {med.frequency}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">{med.purpose}</p>
                  <p className="text-xs text-muted-foreground">Started: {med.startDate}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="medical-glow-green">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Medication Adherence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={adherenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0 / 0.3)" />
                <XAxis dataKey="month" stroke="oklch(0.708 0 0)" />
                <YAxis stroke="oklch(0.708 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0 0)",
                    border: "1px solid oklch(0.25 0 0 / 0.3)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="adherence" fill="oklch(0.65 0.15 180)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// AI Diagnosis Section
function DiagnosisSection({ 
  nfcScanned, 
  patientData,
  showDiagnosis, 
  diagnosisResult, 
  isAnalyzing, 
  proposedOperation, 
  setProposedOperation, 
  analyzeVitals, 
  setShowDiagnosis 
}: {
  nfcScanned: boolean
  patientData: any
  showDiagnosis: boolean
  diagnosisResult: string
  isAnalyzing: boolean
  proposedOperation: string
  setProposedOperation: (value: string) => void
  analyzeVitals: () => void
  setShowDiagnosis: (value: boolean) => void
}) {
  if (!nfcScanned || !patientData) {
    return (
      <div className="text-center py-12">
        <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-muted-foreground">AI Medical Analysis Unavailable</h3>
        <p className="text-muted-foreground mb-6">
          Please scan the patient's NFC tag first to fetch data from the database. AI diagnosis requires verified patient data for accurate analysis.
        </p>
        <div className="bg-card/30 border border-border/50 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-muted-foreground">
            🔒 Security Protocol: AI diagnosis is only available after successful NFC authentication and data retrieval from the secure medical database.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Patient Data Confirmation */}
      <Card className="medical-glow-green">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-secondary" />
            <h3 className="text-lg font-semibold text-foreground">Patient Data Loaded Successfully</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Patient ID</p>
              <p className="font-medium">{patientData.patientId}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{patientData.patientName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Age</p>
              <p className="font-medium">{patientData.age} years</p>
            </div>
            <div>
              <p className="text-muted-foreground">Gender</p>
              <p className="font-medium">{patientData.gender}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Diagnosis Interface */}
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
              Powered by Akash Network's advanced AI models to analyze comprehensive patient data including vital signs, medical history, medications, lab results, and provide surgical risk assessment.
            </p>
          </div>

          <div className="space-y-6">
            {/* Data Summary */}
            <div className="bg-card/30 border border-border/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-3">Analyzing Patient Data:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Heart className="h-3 w-3 text-destructive" />
                  <span>Vital Signs ({patientData.heartRate})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-3 w-3 text-primary" />
                  <span>Medical History ({patientData.medicalHistory?.length} records)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-3 w-3 text-secondary" />
                  <span>Medications ({patientData.medications?.filter((m: any) => m.status === 'Active').length} active)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-3 w-3 text-chart-4" />
                  <span>Lab Results ({patientData.labResults?.length} reports)</span>
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

            {/* Beautiful Loading Animation */}
            {isAnalyzing && (
              <div className="mt-8 p-8 bg-card/50 border border-border/50 rounded-lg">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-primary/20 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Brain className="h-8 w-8 text-primary animate-pulse" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">AI Analysis in Progress</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <span>Processing patient vital signs...</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <span>Analyzing medical history...</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-chart-4 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <span>Calculating surgical risk factors...</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-destructive rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                        <span>Generating recommendations...</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-primary">
                      🤖 Advanced AI models are analyzing {patientData?.medicalHistory?.length || 0} medical records, 
                      {patientData?.medications?.filter((m: any) => m.status === 'Active').length || 0} active medications, 
                      and {patientData?.labResults?.length || 0} lab reports to provide comprehensive surgical risk assessment.
                    </p>
                  </div>
                </div>
              </div>
            )}

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
  )
}

// Lab Reports Section
function LabReportsSection() {
  const labReports = [
    {
      id: "LAB-2024-001",
      date: "2024-06-15",
      type: "Complete Blood Count",
      status: "Normal",
      doctor: "Dr. Wilson",
    },
    {
      id: "LAB-2024-002",
      date: "2024-05-20",
      type: "Lipid Panel",
      status: "Abnormal",
      doctor: "Dr. Johnson",
    },
    {
      id: "LAB-2024-003",
      date: "2024-04-10",
      type: "Thyroid Function",
      status: "Normal",
      doctor: "Dr. Smith",
    },
  ]

  const bloodWorkTrends = [
    { test: "Cholesterol", value: 180, normal: "< 200", status: "normal" },
    { test: "Glucose", value: 95, normal: "70-100", status: "normal" },
    { test: "Hemoglobin", value: 14.2, normal: "12-16", status: "normal" },
    { test: "White Blood Cells", value: 7.5, normal: "4-11", status: "normal" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="medical-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-primary" />
              Recent Lab Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {labReports.map((report, index) => (
                <div key={index} className="p-4 bg-card/50 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{report.type}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={report.status === "Normal" ? "secondary" : "destructive"}>{report.status}</Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {report.type} - {report.id}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="p-6 bg-card/50 rounded-lg">
                            <p className="text-muted-foreground">Lab report details would be displayed here...</p>
                            <div className="mt-4 flex gap-2">
                              <Button size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{report.doctor}</p>
                  <p className="text-xs text-muted-foreground">{report.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="medical-glow-green">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Blood Work Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bloodWorkTrends.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <div>
                    <p className="font-medium">{test.test}</p>
                    <p className="text-sm text-muted-foreground">Normal: {test.normal}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-lg">{test.value}</p>
                    <Badge variant="secondary" className="text-xs">
                      Normal
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PatientDashboard() {
  const [activeSection, setActiveSection] = useState("vitals")
  const [showNFCModal, setShowNFCModal] = useState(false)
  const [showDiagnosis, setShowDiagnosis] = useState(false)
  const [diagnosisResult, setDiagnosisResult] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [proposedOperation, setProposedOperation] = useState("")
  const [nfcScanned, setNfcScanned] = useState(false)
  const [patientData, setPatientData] = useState<any>(null)
  const router = useRouter()

  // Load patient data from localStorage on component mount
  useEffect(() => {
    const storedPatientData = localStorage.getItem('patientData')
    const storedNfcScanned = localStorage.getItem('nfcScanned')
    
    if (storedPatientData && storedNfcScanned === 'true') {
      setPatientData(JSON.parse(storedPatientData))
      setNfcScanned(true)
      // Keep vitals as default section - diagnosis moved after lab reports
      setActiveSection("vitals")
    }
  }, [])

  // Simulate NFC scan and data fetch
  const handleNFCScan = () => {
    setShowNFCModal(true)
    // Simulate NFC scan success and data fetch from database
    setTimeout(() => {
      setNfcScanned(true)
      // Simulate fetching patient data from database (like from Supabase)
      const fetchedPatientData = {
        // Current Vital Signs
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
        
        // Medical History
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
        
        // Current Medications
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
        
        // Lab Results
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
        
        // Blood Work Values
        bloodWork: [
          { test: "Cholesterol", value: 180, normal: "< 200", status: "normal" },
          { test: "Glucose", value: 95, normal: "70-100", status: "normal" },
          { test: "Hemoglobin", value: 14.2, normal: "12-16", status: "normal" },
          { test: "White Blood Cells", value: 7.5, normal: "4-11", status: "normal" }
        ]
      }
      setPatientData(fetchedPatientData)
      // Keep vitals as default section after successful scan
      setActiveSection("vitals")
    }, 2000)
  }

  // Function to analyze vitals and navigate to results page
  const analyzeVitals = async () => {
    if (!proposedOperation.trim()) {
      alert("Please enter a proposed operation or procedure")
      return
    }

    if (!patientData) {
      alert("Patient data not available. Please scan NFC first.")
      return
    }

    setIsAnalyzing(true)

    // Store the proposed operation in localStorage for the results page
    localStorage.setItem('proposedOperation', proposedOperation)

    // Simulate analysis time with beautiful loading
    setTimeout(() => {
      setIsAnalyzing(false)
      // Navigate to the new diagnosis results page
      router.push('/diagnosis')
    }, 3000) // 3 second loading animation
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "vitals":
        return <VitalsSection />
      case "history":
        return <HistorySection />
      case "diagnosis":
        return (
          <DiagnosisSection
            nfcScanned={nfcScanned}
            patientData={patientData}
            showDiagnosis={showDiagnosis}
            diagnosisResult={diagnosisResult}
            isAnalyzing={isAnalyzing}
            proposedOperation={proposedOperation}
            setProposedOperation={setProposedOperation}
            analyzeVitals={analyzeVitals}
            setShowDiagnosis={setShowDiagnosis}
          />
        )
      case "medications":
        return <MedicationsSection />
      case "lab-reports":
        return <LabReportsSection />
      default:
        return <VitalsSection />
    }
  }

  return (
    <div className="min-h-screen bg-background grid-pattern flex">
      {/* Sidebar */}
      <PatientSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Patient Medical Records</h1>
                <p className="text-sm text-muted-foreground">Comprehensive health history and monitoring</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="medical-glow-green">
                <Activity className="h-3 w-3 mr-1" />
                Active Patient
              </Badge>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">{renderActiveSection()}</div>
        </main>
      </div>

      {/* NFC Scanner Modal */}
      <NFCScannerModal isOpen={showNFCModal} onClose={() => setShowNFCModal(false)} />
    </div>
  )
}
