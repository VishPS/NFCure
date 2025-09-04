"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle,
  Zap,
  Heart,
  Thermometer,
  Droplets,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Shield,
} from "lucide-react"
import Link from "next/link"

// AI Brain Animation Component
function AIBrainAnimation({ isProcessing }: { isProcessing: boolean }) {
  return (
    <div className="relative w-24 h-24 mx-auto mb-6">
      <div className={`absolute inset-0 rounded-full border-2 border-primary ${isProcessing ? "animate-spin" : ""}`}>
        <div className="absolute top-2 left-2 w-4 h-4 bg-primary rounded-full animate-pulse" />
        <div
          className="absolute top-4 right-3 w-3 h-3 bg-secondary rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute bottom-3 left-4 w-2 h-2 bg-primary rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-4 right-2 w-3 h-3 bg-secondary rounded-full animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>
      <Brain className="absolute inset-0 m-auto h-12 w-12 text-primary" />
      {isProcessing && <div className="absolute -inset-4 rounded-full border border-primary/30 animate-ping" />}
    </div>
  )
}

// Vital Stats Mini Component
function VitalStatsMini({ isUpdating }: { isUpdating: boolean }) {
  const [vitals, setVitals] = useState({
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 98.6,
    oxygenSat: 98,
  })

  useEffect(() => {
    if (isUpdating) {
      const interval = setInterval(() => {
        setVitals((prev) => ({
          heartRate: prev.heartRate + Math.floor(Math.random() * 6) - 3,
          bloodPressure: prev.bloodPressure,
          temperature: prev.temperature + Math.random() * 0.4 - 0.2,
          oxygenSat: prev.oxygenSat + Math.floor(Math.random() * 2) - 1,
        }))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isUpdating])

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <div className={`flex items-center gap-2 p-2 rounded-lg bg-card/50 ${isUpdating ? "animate-pulse" : ""}`}>
        <Heart className="h-4 w-4 text-destructive" />
        <span className="text-sm font-mono">{vitals.heartRate}</span>
      </div>
      <div className={`flex items-center gap-2 p-2 rounded-lg bg-card/50 ${isUpdating ? "animate-pulse" : ""}`}>
        <Activity className="h-4 w-4 text-primary" />
        <span className="text-sm font-mono">{vitals.bloodPressure}</span>
      </div>
      <div className={`flex items-center gap-2 p-2 rounded-lg bg-card/50 ${isUpdating ? "animate-pulse" : ""}`}>
        <Thermometer className="h-4 w-4 text-chart-4" />
        <span className="text-sm font-mono">{vitals.temperature.toFixed(1)}°F</span>
      </div>
      <div className={`flex items-center gap-2 p-2 rounded-lg bg-card/50 ${isUpdating ? "animate-pulse" : ""}`}>
        <Droplets className="h-4 w-4 text-secondary" />
        <span className="text-sm font-mono">{vitals.oxygenSat}%</span>
      </div>
    </div>
  )
}

// Recommendation Card with Flip Animation
function RecommendationCard({
  title,
  description,
  risk,
  confidence,
  details,
  type = "recommendation",
}: {
  title: string
  description: string
  risk: "low" | "medium" | "high"
  confidence: number
  details: string
  type?: "recommendation" | "risk" | "alternative"
}) {
  const [isFlipped, setIsFlipped] = useState(false)

  const riskColors = {
    low: "text-secondary border-secondary/30 bg-secondary/10",
    medium: "text-chart-4 border-chart-4/30 bg-chart-4/10",
    high: "text-destructive border-destructive/30 bg-destructive/10",
  }

  const typeIcons = {
    recommendation: CheckCircle,
    risk: AlertTriangle,
    alternative: Sparkles,
  }

  const Icon = typeIcons[type]

  return (
    <div className="relative h-48 cursor-pointer perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
      <div
        className={`absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
      >
        {/* Front Side */}
        <Card className="absolute inset-0 backface-hidden medical-glow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-primary" />
              <Badge className={riskColors[risk]}>{risk.toUpperCase()}</Badge>
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Confidence</span>
                <span>{confidence}%</span>
              </div>
              <Progress value={confidence} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Back Side */}
        <Card className="absolute inset-0 backface-hidden rotate-y-180 medical-glow-green">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Detailed Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{details}</p>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">Click to flip back</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DoctorDashboard() {
  const [symptoms, setSymptoms] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [treatment, setTreatment] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const handleAnalyze = async () => {
    setIsProcessing(true)
    setShowResults(false)
    setAnalysisProgress(0)

    // Simulate AI processing with progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsProcessing(false)
          setShowResults(true)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }

  const recommendations = [
    {
      title: "Primary Treatment Protocol",
      description: "Recommended first-line treatment based on symptom analysis and patient history.",
      risk: "low" as const,
      confidence: 94,
      details:
        "This treatment protocol has shown 94% success rate in similar cases. Monitor patient response after 48 hours and adjust dosage if necessary. Consider alternative if no improvement within 72 hours.",
      type: "recommendation" as const,
    },
    {
      title: "Potential Drug Interaction",
      description: "Identified possible interaction with current medications in patient profile.",
      risk: "medium" as const,
      confidence: 78,
      details:
        "Current medication may reduce effectiveness of proposed treatment by 15-20%. Consider spacing doses by 4 hours or switching to alternative medication with similar efficacy.",
      type: "risk" as const,
    },
    {
      title: "Alternative Therapy Option",
      description: "Non-pharmaceutical approach with proven efficacy for this condition.",
      risk: "low" as const,
      confidence: 87,
      details:
        "Physical therapy combined with lifestyle modifications shows 87% improvement rate. Recommended as complementary treatment or primary option for patients preferring non-drug approaches.",
      type: "alternative" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center medical-glow">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Doctor Assistant</h1>
                <p className="text-sm text-muted-foreground">Intelligent diagnosis and treatment recommendations</p>
              </div>
            </div>
          </div>

          <Badge variant="secondary" className="medical-glow-green">
            <Zap className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Doctor Input */}
          <div className="space-y-6">
            <Card className="medical-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Patient Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Symptoms</label>
                  <Textarea
                    placeholder="Describe patient symptoms, onset, duration, and severity..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-24 bg-input border-border/50 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Preliminary Diagnosis</label>
                  <Input
                    placeholder="Enter suspected diagnosis or differential diagnoses..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="bg-input border-border/50 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Suggested Treatment</label>
                  <Textarea
                    placeholder="Proposed treatment plan, medications, dosages..."
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="min-h-20 bg-input border-border/50 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={isProcessing || !symptoms || !diagnosis}
                  className="w-full medical-glow pulse-animation"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Brain className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Analyze with AI
                    </>
                  )}
                </Button>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>AI Analysis Progress</span>
                      <span>{Math.round(analysisProgress)}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Digital Twin Vitals */}
            <Card className="medical-glow-green">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-secondary" />
                  Digital Twin Vitals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VitalStatsMini isUpdating={isProcessing || symptoms.length > 0} />
                <p className="text-xs text-muted-foreground">Vitals update in real-time as you input patient data</p>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - AI Results */}
          <div className="space-y-6">
            <Card className="medical-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showResults && !isProcessing && (
                  <div className="text-center py-12">
                    <AIBrainAnimation isProcessing={false} />
                    <p className="text-muted-foreground">
                      Enter patient information and click "Analyze with AI" to get intelligent recommendations
                    </p>
                  </div>
                )}

                {isProcessing && (
                  <div className="text-center py-12">
                    <AIBrainAnimation isProcessing={true} />
                    <p className="text-foreground font-medium mb-2">Processing patient data...</p>
                    <p className="text-sm text-muted-foreground">
                      Analyzing symptoms, cross-referencing medical databases, and generating recommendations
                    </p>
                  </div>
                )}

                {showResults && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-secondary" />
                      <span className="font-medium">Analysis Complete</span>
                    </div>

                    <div className="grid gap-4">
                      {recommendations.map((rec, index) => (
                        <RecommendationCard key={index} {...rec} />
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> AI recommendations are for reference only. Always use clinical judgment
                        and follow established medical protocols.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
