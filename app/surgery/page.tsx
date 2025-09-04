"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float, Html } from "@react-three/drei"
import { Suspense, useRef, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Scale as Scalpel,
  Heart,
  Brain,
  Bone,
  Eye,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Timer,
  Activity,
  Shield,
} from "lucide-react"
import Link from "next/link"
import type * as THREE from "three"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

// Enhanced 3D Human Model with Body Part Highlighting
function Enhanced3DHuman({
  selectedBodyPart,
  riskLevel,
}: { selectedBodyPart: string | null; riskLevel: "safe" | "moderate" | "high" }) {
  const meshRef = useRef<THREE.Mesh>(null)

  const getBodyPartColor = (part: string) => {
    if (selectedBodyPart !== part) return "#0d74ff"

    switch (riskLevel) {
      case "safe":
        return "#00bfae"
      case "moderate":
        return "#f39c12"
      case "high":
        return "#ff4d4d"
      default:
        return "#0d74ff"
    }
  }

  const getBodyPartOpacity = (part: string) => {
    return selectedBodyPart === part ? 0.8 : 0.3
  }

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      {/* Torso */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 2, 12]} />
        <meshStandardMaterial
          color={getBodyPartColor("torso")}
          transparent
          opacity={getBodyPartOpacity("torso")}
          wireframe={selectedBodyPart !== "torso"}
        />
        {selectedBodyPart === "torso" && (
          <Html position={[0.6, 0, 0]}>
            <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-2 text-xs">
              Torso Selected
            </div>
          </Html>
        )}
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial
          color={getBodyPartColor("head")}
          transparent
          opacity={getBodyPartOpacity("head")}
          wireframe={selectedBodyPart !== "head"}
        />
        {selectedBodyPart === "head" && (
          <Html position={[0.4, 0, 0]}>
            <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-2 text-xs">
              Head/Brain Selected
            </div>
          </Html>
        )}
      </mesh>

      {/* Heart Area */}
      <mesh position={[-0.1, 0.3, 0.2]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial
          color={getBodyPartColor("heart")}
          transparent
          opacity={getBodyPartOpacity("heart")}
          wireframe={selectedBodyPart !== "heart"}
        />
        {selectedBodyPart === "heart" && (
          <Html position={[0.3, 0, 0]}>
            <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-2 text-xs">
              Cardiac Region
            </div>
          </Html>
        )}
      </mesh>

      {/* Arms */}
      <mesh position={[-0.7, 0.2, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.08, 0.08, 1.4, 8]} />
        <meshStandardMaterial
          color={getBodyPartColor("arms")}
          transparent
          opacity={getBodyPartOpacity("arms")}
          wireframe={selectedBodyPart !== "arms"}
        />
      </mesh>

      <mesh position={[0.7, 0.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.08, 0.08, 1.4, 8]} />
        <meshStandardMaterial
          color={getBodyPartColor("arms")}
          transparent
          opacity={getBodyPartOpacity("arms")}
          wireframe={selectedBodyPart !== "arms"}
        />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.2, -1.7, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 1.8, 8]} />
        <meshStandardMaterial
          color={getBodyPartColor("legs")}
          transparent
          opacity={getBodyPartOpacity("legs")}
          wireframe={selectedBodyPart !== "legs"}
        />
      </mesh>

      <mesh position={[0.2, -1.7, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 1.8, 8]} />
        <meshStandardMaterial
          color={getBodyPartColor("legs")}
          transparent
          opacity={getBodyPartOpacity("legs")}
          wireframe={selectedBodyPart !== "legs"}
        />
      </mesh>
    </Float>
  )
}

// Surgery Type Selection Component
function SurgeryTypeSelector({ onSelect, selected }: { onSelect: (surgery: any) => void; selected: any }) {
  const surgeryTypes = [
    {
      id: "cardiac",
      name: "Cardiac Surgery",
      icon: Heart,
      bodyPart: "heart",
      riskLevel: "high" as const,
      duration: "4-6 hours",
      successRate: 94,
      description: "Heart valve replacement or bypass surgery",
    },
    {
      id: "neurological",
      name: "Neurological Surgery",
      icon: Brain,
      bodyPart: "head",
      riskLevel: "high" as const,
      duration: "6-8 hours",
      successRate: 89,
      description: "Brain tumor removal or aneurysm repair",
    },
    {
      id: "orthopedic",
      name: "Orthopedic Surgery",
      icon: Bone,
      bodyPart: "legs",
      riskLevel: "moderate" as const,
      duration: "2-4 hours",
      successRate: 97,
      description: "Joint replacement or fracture repair",
    },
    {
      id: "ophthalmic",
      name: "Ophthalmic Surgery",
      icon: Eye,
      bodyPart: "head",
      riskLevel: "safe" as const,
      duration: "1-2 hours",
      successRate: 99,
      description: "Cataract or retinal surgery",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3">
      {surgeryTypes.map((surgery) => {
        const Icon = surgery.icon
        const isSelected = selected?.id === surgery.id

        return (
          <Card
            key={surgery.id}
            className={`cursor-pointer transition-all duration-300 ${
              isSelected ? "medical-glow border-primary bg-primary/10" : "hover:medical-glow-green border-border/50"
            }`}
            onClick={() => onSelect(surgery)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                <h3 className="font-medium">{surgery.name}</h3>
                <Badge
                  variant={
                    surgery.riskLevel === "safe"
                      ? "secondary"
                      : surgery.riskLevel === "moderate"
                        ? "outline"
                        : "destructive"
                  }
                  className="ml-auto"
                >
                  {surgery.riskLevel}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{surgery.description}</p>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Duration: {surgery.duration}</span>
                <span>Success: {surgery.successRate}%</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Simulation Results Component
function SimulationResults({ surgery, isRunning }: { surgery: any; isRunning: boolean }) {
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState("Preparation")

  const phases = ["Preparation", "Incision", "Primary Procedure", "Closure", "Recovery"]

  const survivalData = [
    { time: 0, rate: 100, recovery: 0 },
    { time: 1, rate: 99.5, recovery: 10 },
    { time: 2, rate: 99.2, recovery: 25 },
    { time: 3, rate: 98.8, recovery: 45 },
    { time: 4, rate: 98.5, recovery: 65 },
    { time: 5, rate: 98.2, recovery: 80 },
    { time: 6, rate: 98.0, recovery: 90 },
    { time: 7, rate: 97.8, recovery: 95 },
    { time: 8, rate: 97.5, recovery: 98 },
  ]

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 2
          const phaseIndex = Math.floor(newProgress / 20)
          if (phaseIndex < phases.length) {
            setCurrentPhase(phases[phaseIndex])
          }
          return newProgress > 100 ? 100 : newProgress
        })
      }, 200)
      return () => clearInterval(interval)
    }
  }, [isRunning])

  if (!surgery) {
    return (
      <div className="text-center py-12">
        <Scalpel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Select a surgery type to begin simulation</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Surgery Info */}
      <div className="flex items-center gap-3 mb-4">
        <surgery.icon className="h-6 w-6 text-primary" />
        <div>
          <h3 className="font-semibold">{surgery.name}</h3>
          <p className="text-sm text-muted-foreground">{surgery.description}</p>
        </div>
      </div>

      {/* Simulation Progress */}
      {isRunning && (
        <Card className="medical-glow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 animate-pulse text-primary" />
              Simulation in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Current Phase: {currentPhase}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Timer className="h-4 w-4 mx-auto mb-1 text-secondary" />
                  <p className="text-xs text-muted-foreground">Elapsed</p>
                  <p className="font-mono text-sm">
                    {Math.floor(progress * 0.06)}:{String(Math.floor((progress * 3.6) % 60)).padStart(2, "0")}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-4 w-4 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                  <p className="font-mono text-sm">{(surgery.successRate - progress * 0.02).toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-chart-4/10 rounded-lg">
                  <Shield className="h-4 w-4 mx-auto mb-1 text-chart-4" />
                  <p className="text-xs text-muted-foreground">Risk Level</p>
                  <p className="font-mono text-sm capitalize">{surgery.riskLevel}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="medical-glow-green">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Survival Rate Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={survivalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0 / 0.3)" />
                <XAxis dataKey="time" stroke="oklch(0.708 0 0)" />
                <YAxis domain={[95, 100]} stroke="oklch(0.708 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0 0)",
                    border: "1px solid oklch(0.25 0 0 / 0.3)",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="oklch(0.65 0.15 180)"
                  strokeWidth={2}
                  dot={{ fill: "oklch(0.65 0.15 180)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="medical-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recovery Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={survivalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0 / 0.3)" />
                <XAxis dataKey="time" stroke="oklch(0.708 0 0)" />
                <YAxis stroke="oklch(0.708 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.17 0 0)",
                    border: "1px solid oklch(0.25 0 0 / 0.3)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="recovery"
                  stroke="oklch(0.55 0.25 250)"
                  fill="oklch(0.55 0.25 250 / 0.3)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-chart-4" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-secondary" />
                <span className="text-sm">Patient Age Compatibility</span>
              </div>
              <Badge variant="secondary">Low Risk</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-chart-4/10 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-chart-4" />
                <span className="text-sm">Comorbidity Factors</span>
              </div>
              <Badge variant="outline">Moderate Risk</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-secondary" />
                <span className="text-sm">Surgical Team Experience</span>
              </div>
              <Badge variant="secondary">Low Risk</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SurgerySimulation() {
  const [selectedSurgery, setSelectedSurgery] = useState<any>(null)
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const [simulationComplete, setSimulationComplete] = useState(false)

  const handleStartSimulation = () => {
    setIsSimulationRunning(true)
    setSimulationComplete(false)

    // Auto-complete simulation after 20 seconds
    setTimeout(() => {
      setIsSimulationRunning(false)
      setSimulationComplete(true)
    }, 20000)
  }

  const handleResetSimulation = () => {
    setIsSimulationRunning(false)
    setSimulationComplete(false)
  }

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
                <Scalpel className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Surgery Simulation</h1>
                <p className="text-sm text-muted-foreground">Advanced surgical planning and risk assessment</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleStartSimulation}
              disabled={!selectedSurgery || isSimulationRunning}
              className="medical-glow"
            >
              {isSimulationRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Simulation
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleResetSimulation}
              disabled={!selectedSurgery}
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Surgery Selection */}
          <div className="space-y-6">
            <Card className="medical-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scalpel className="h-5 w-5 text-primary" />
                  Surgery Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SurgeryTypeSelector onSelect={setSelectedSurgery} selected={selectedSurgery} />
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - 3D Model */}
          <div className="space-y-6">
            <Card className="medical-glow-green">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-secondary" />
                  Digital Twin Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full">
                  <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                    <Suspense fallback={null}>
                      <ambientLight intensity={0.6} />
                      <pointLight position={[10, 10, 10]} intensity={1} color="#0d74ff" />
                      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00bfae" />

                      <Enhanced3DHuman
                        selectedBodyPart={selectedSurgery?.bodyPart || null}
                        riskLevel={selectedSurgery?.riskLevel || "safe"}
                      />

                      <OrbitControls enableZoom={true} enablePan={false} />
                      <Environment preset="night" />
                    </Suspense>
                  </Canvas>
                </div>

                {selectedSurgery && (
                  <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Target Area:</strong> {selectedSurgery.bodyPart} - {selectedSurgery.name}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Simulation Results */}
          <div className="space-y-6">
            <Card className="medical-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Simulation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimulationResults surgery={selectedSurgery} isRunning={isSimulationRunning} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
