"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Suspense, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Activity, Thermometer, Droplets, Zap, Scan } from "lucide-react"
import type * as THREE from "three"
import NFCScannerModal from "@/components/nfc-scanner-modal"
import { useRouter } from "next/navigation"
import Link from "next/link"

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
  const router = useRouter()

  // Handle NFC scan from homepage
  const handleNFCScan = () => {
    setShowNFCModal(true)
    // Let the NFC scanner modal handle the entire flow
    // No automatic navigation - user must complete the NFC scan process
  }

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
            <Link href="/contact">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Contact Us
              </Button>
            </Link>
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

          {/* GIF Container */}
          <div className="relative h-[450px] w-full mb-12 flex items-center justify-center">
            <img 
              src="https://assets.superhivemarket.com/cache/12da5a4fb6d9da25828a2b5e61d60712.gif"
              alt="Medical Animation"
              className="max-h-full max-w-full object-contain rounded-lg medical-glow"
            />
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
              onClick={handleNFCScan}
            >
              <Scan className="mr-2 h-5 w-5" />
              Scan NFC
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground medical-glow-green bg-transparent"
            >
              Learn About NFCure AI Medical Platform
            </Button>
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
