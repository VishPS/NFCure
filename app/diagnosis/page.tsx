"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Brain,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Stethoscope,
  Activity,
  Shield,
  TrendingUp,
  Download,
  Share,
  Calendar,
  FileText,
  Zap
} from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell } from "recharts"
import { akashAPI } from "@/lib/akash-api"

// Risk Assessment Component
function RiskAssessment({ riskLevel, riskScore, successRate, timeline }: { 
  riskLevel: string, 
  riskScore: number, 
  successRate: number,
  timeline: any 
}) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-destructive'
      case 'moderate': return 'text-yellow-500'
      default: return 'text-secondary'
    }
  }

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'high': return 'destructive'
      case 'moderate': return 'secondary'
      default: return 'secondary'
    }
  }

  return (
    <Card className="medical-glow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Surgical Risk Assessment
          </div>
          <Badge variant={getRiskBadgeVariant(riskLevel)} className="uppercase">
            {riskLevel} RISK
          </Badge>
        </CardTitle>
        <CardDescription>AI-powered risk analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Risk Score</span>
              <span className="font-mono">{riskScore}%</span>
            </div>
            <Progress value={riskScore} className="h-3" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-card/50 rounded-lg">
              <div className="text-2xl font-bold text-secondary">{successRate}%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
            <div className="p-3 bg-card/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{timeline.duration || '2-3h'}</div>
              <div className="text-xs text-muted-foreground">Est. Duration</div>
            </div>
            <div className="p-3 bg-card/50 rounded-lg">
              <div className="text-2xl font-bold text-chart-4">{timeline.hospitalStay || '5-7d'}</div>
              <div className="text-xs text-muted-foreground">Recovery</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Vital Signs Analysis Component
function VitalSignsAnalysis({ vitalSigns }: { vitalSigns: any[] }) {
  return (
    <Card className="medical-glow-green">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-destructive" />
          AI-Analyzed Vital Signs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {vitalSigns.map((vital, index) => (
            <div key={index} className="p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{vital.name}</span>
                <Badge variant="secondary" className="text-xs">✅ Normal</Badge>
              </div>
              <div className="text-2xl font-bold text-foreground">{vital.value}</div>
              <div className="text-xs text-muted-foreground">Status: {vital.status}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Risk Factors Component
function RiskFactors() {
  const riskFactors = [
    { factor: 'Age', level: 'Low', description: '45 years - within optimal range', severity: 'low' },
    { factor: 'Medical History', level: 'Moderate', description: 'Previous appendectomy, ongoing hypertension', severity: 'moderate' },
    { factor: 'Current Medications', level: 'Low', description: 'Well-controlled with current regimen', severity: 'low' },
    { factor: 'Lab Results', level: 'Low', description: 'All values within normal ranges', severity: 'low' },
    { factor: 'Cardiovascular Health', level: 'Low', description: 'Stable vitals, good cardiac function', severity: 'low' }
  ]

  return (
    <Card className="medical-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-chart-4" />
          Risk Factor Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {riskFactors.map((risk, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-card/50 rounded-lg border border-border/50">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  risk.severity === 'high' ? 'bg-destructive' :
                  risk.severity === 'moderate' ? 'bg-chart-4' : 'bg-secondary'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{risk.factor}</h4>
                    <Badge 
                      variant={risk.severity === 'high' ? 'destructive' : risk.severity === 'moderate' ? 'outline' : 'secondary'}
                      className="text-xs"
                    >
                      {risk.level}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{risk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Dynamic Recommendations Component
function DynamicRecommendations({ dynamicSections, timeline }: { dynamicSections: any, timeline: any }) {
  const getIconForSection = (sectionTitle: string) => {
    const title = sectionTitle.toLowerCase()
    if (title.includes('pre-operative') || title.includes('preparation')) return Calendar
    if (title.includes('surgical') || title.includes('during')) return Stethoscope
    if (title.includes('post-operative') || title.includes('recovery')) return Heart
    if (title.includes('recommendation')) return CheckCircle
    if (title.includes('risk')) return AlertTriangle
    if (title.includes('timeline')) return Clock
    return FileText
  }

  const getColorForSection = (index: number) => {
    const colors = ['text-primary', 'text-secondary', 'text-chart-4', 'text-destructive', 'text-chart-1']
    return colors[index % colors.length]
  }

  return (
    <div className="space-y-6">
      <Card className="medical-glow-green">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-secondary" />
            Akash AI Analysis Sections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(dynamicSections).map(([sectionTitle, items]: [string, any], index) => {
              const IconComponent = getIconForSection(sectionTitle)
              const colorClass = getColorForSection(index)
              
              return (
                <div key={index} className="p-4 bg-card/50 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <IconComponent className={`h-4 w-4 ${colorClass}`} />
                    <h4 className="font-medium text-primary">{sectionTitle}</h4>
                  </div>
                  <ul className="space-y-2">
                    {items.map((item: string, itemIndex: number) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recovery Timeline */}
      {(timeline.hospitalStay || timeline.fullRecovery || timeline.returnToActivities) && (
        <Card className="medical-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recovery Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-primary mb-2">{timeline.hospitalStay}</div>
                <div className="text-sm text-muted-foreground">Hospital Stay</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-secondary mb-2">{timeline.fullRecovery}</div>
                <div className="text-sm text-muted-foreground">Full Recovery</div>
              </div>
              <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
                <div className="text-2xl font-bold text-chart-4 mb-2">{timeline.returnToActivities}</div>
                <div className="text-sm text-muted-foreground">Return to Activities</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function DiagnosisResults() {
  const [patientData, setPatientData] = useState<any>(null)
  const [proposedOperation, setProposedOperation] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Export functions
  const exportToPDF = () => {
    const reportContent = generateReportHTML()
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(reportContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const shareReport = async () => {
    const reportData = {
      patient: patientData?.patientName || 'Unknown Patient',
      procedure: proposedOperation,
      riskLevel: analysisResult?.riskLevel,
      riskScore: analysisResult?.riskScore,
      successRate: analysisResult?.successRate,
      timestamp: new Date().toISOString(),
      summary: analysisResult?.fullAnalysis?.substring(0, 200) + '...'
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Medical Risk Assessment - ${reportData.patient}`,
          text: `Risk Assessment for ${reportData.procedure}: ${reportData.riskLevel} risk (${reportData.riskScore}%), ${reportData.successRate}% success rate`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled or failed')
        fallbackShare(reportData)
      }
    } else {
      fallbackShare(reportData)
    }
  }

  const fallbackShare = (reportData: any) => {
    const shareText = `Medical Risk Assessment Report
Patient: ${reportData.patient}
Procedure: ${reportData.procedure}
Risk Level: ${reportData.riskLevel} (${reportData.riskScore}%)
Success Rate: ${reportData.successRate}%
Generated: ${new Date().toLocaleDateString()}

View full report: ${window.location.href}`

    navigator.clipboard.writeText(shareText).then(() => {
      alert('Report summary copied to clipboard!')
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareText
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Report summary copied to clipboard!')
    })
  }

  const downloadJSON = () => {
    const exportData = {
      patient: {
        name: patientData?.patientName,
        id: patientData?.patientId,
        age: patientData?.age,
        gender: patientData?.gender
      },
      analysis: {
        procedure: proposedOperation,
        riskLevel: analysisResult?.riskLevel,
        riskScore: analysisResult?.riskScore,
        successRate: analysisResult?.successRate,
        vitalSigns: analysisResult?.vitalSigns,
        timeline: analysisResult?.timeline,
        dynamicSections: analysisResult?.dynamicSections,
        fullAnalysis: analysisResult?.fullAnalysis
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        aiModel: 'Meta-Llama-3-1-405B-Instruct-FP8',
        version: '1.0'
      }
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `medical-analysis-${patientData?.patientName?.replace(/\s+/g, '-') || 'patient'}-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const generateReportHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Medical Risk Assessment Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .risk-high { color: #dc2626; font-weight: bold; }
            .risk-moderate { color: #f59e0b; font-weight: bold; }
            .risk-low { color: #16a34a; font-weight: bold; }
            .vital-signs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
            .vital-card { border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; }
            .timeline { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
            .timeline-item { text-align: center; padding: 15px; background: #f9fafb; border-radius: 8px; }
            .recommendations { margin: 20px 0; }
            .recommendation-section { margin-bottom: 20px; }
            .recommendation-list { list-style-type: disc; margin-left: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medical Risk Assessment Report</h1>
            <h2>Patient: ${patientData?.patientName || 'N/A'}</h2>
            <h3>Proposed Procedure: ${proposedOperation}</h3>
            <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>AI Model: Meta-Llama-3-1-405B-Instruct-FP8</p>
          </div>

          <div class="section">
            <h2>Risk Assessment Summary</h2>
            <p><strong>Risk Level:</strong> <span class="risk-${analysisResult?.riskLevel}">${analysisResult?.riskLevel?.toUpperCase()} RISK</span></p>
            <p><strong>Risk Score:</strong> ${analysisResult?.riskScore}%</p>
            <p><strong>Success Rate:</strong> ${analysisResult?.successRate}%</p>
          </div>

          <div class="section">
            <h2>Timeline</h2>
            <div class="timeline">
              <div class="timeline-item">
                <strong>Hospital Stay</strong><br>
                ${analysisResult?.timeline?.hospitalStay || 'N/A'}
              </div>
              <div class="timeline-item">
                <strong>Full Recovery</strong><br>
                ${analysisResult?.timeline?.fullRecovery || 'N/A'}
              </div>
              <div class="timeline-item">
                <strong>Return to Activities</strong><br>
                ${analysisResult?.timeline?.returnToActivities || 'N/A'}
              </div>
            </div>
          </div>

          ${analysisResult?.vitalSigns?.length > 0 ? `
          <div class="section">
            <h2>Vital Signs Analysis</h2>
            <div class="vital-signs">
              ${analysisResult.vitalSigns.map((vital: any) => `
                <div class="vital-card">
                  <strong>${vital.name}:</strong> ${vital.value}<br>
                  <small>Status: ${vital.status}</small>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          ${Object.keys(analysisResult?.dynamicSections || {}).length > 0 ? `
          <div class="section recommendations">
            <h2>AI Recommendations & Analysis</h2>
            ${Object.entries(analysisResult.dynamicSections).map(([title, items]: [string, any]) => `
              <div class="recommendation-section">
                <h3>${title}</h3>
                <ul class="recommendation-list">
                  ${items.map((item: string) => `<li>${item}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <div class="section">
            <h2>Full AI Analysis</h2>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; white-space: pre-wrap; font-family: monospace; font-size: 12px;">
${analysisResult?.fullAnalysis || 'No detailed analysis available'}
            </div>
          </div>

          <div class="section" style="margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>This report was generated by NFCure AI Medical Analysis System</p>
            <p>For medical decisions, always consult with qualified healthcare professionals</p>
          </div>
        </body>
      </html>
    `
  }

  useEffect(() => {
    // Load data from localStorage
    const storedPatientData = localStorage.getItem('patientData')
    const storedOperation = localStorage.getItem('proposedOperation')
    
    if (storedPatientData && storedOperation) {
      const patient = JSON.parse(storedPatientData)
      setPatientData(patient)
      setProposedOperation(storedOperation)
      
      // Start AI analysis
      performAIAnalysis(patient, storedOperation)
    } else {
      setIsLoading(false)
    }
  }, [])

  const performAIAnalysis = async (patient: any, operation: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const medicalData = {
        ...patient,
        proposedOperation: operation
      }

      // Try real Akash API first
      let result
      try {
        result = await akashAPI.analyzeMedicalData(medicalData)
      } catch (apiError) {
        console.warn('Akash API failed, using simulation:', apiError)
        // Fallback to simulation if API fails
        result = await akashAPI.simulateAnalysis(medicalData)
      }

      // Parse the AI result to extract structured data
      const parsedResult = parseAIResult(result, operation)
      setAnalysisResult(parsedResult)
    } catch (error) {
      console.error('Analysis error:', error)
      setError('Failed to analyze medical data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const parseAIResult = (aiText: string, operation: string) => {
    // Extract risk level and score
    const riskLevel = aiText.includes('🔴 HIGH RISK') ? 'high' : 
                     aiText.includes('🟡 MODERATE RISK') ? 'moderate' : 'low'
    
    const riskScore = riskLevel === 'high' ? 75 : riskLevel === 'moderate' ? 45 : 25
    
    // Extract success probability - try multiple patterns
    const successMatch = aiText.match(/Success Probability:\*\*\s*(\d+)%/i) || 
                         aiText.match(/(\d+)%\s*based on/i) ||
                         aiText.match(/(\d+)%.*success/i)
    const successRate = successMatch ? parseInt(successMatch[1]) : 85
    
    // Parse vital signs dynamically
    const vitalSigns: Array<{name: string, value: string, status: string}> = []
    const vitalLines = aiText.match(/\*\*Patient Vital Signs Analysis:\*\*([\s\S]*?)(?=\*\*|$)/)
    if (vitalLines) {
      const lines = vitalLines[1].split('\n')
      lines.forEach(line => {
        const vitalMatch = line.match(/✅\s*([^:]+):\s*([^(]+)/i)
        if (vitalMatch) {
          vitalSigns.push({ 
            name: vitalMatch[1].trim(), 
            value: vitalMatch[2].trim(), 
            status: 'normal' 
          })
        }
      })
    }
    
    // Enhanced dynamic section parsing - find all **Section:** or **SECTION** patterns
    const dynamicSections: Record<string, string[]> = {}
    
    // Split text into lines for better processing
    const lines = aiText.split('\n')
    let currentSection = ''
    let currentItems: string[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Check if this line is a main heading (wrapped in **)
      const headingMatch = line.match(/^\*\*([^*]+)\*\*:?\s*$/) || 
                          line.match(/^\*\*([^*]+):\*\*\s*$/)
      
      if (headingMatch) {
        // Save previous section if it exists
        if (currentSection && currentItems.length > 0) {
          // Skip certain sections we handle separately
          if (!currentSection.includes('Patient Vital Signs') && 
              !currentSection.includes('Risk Assessment') &&
              !currentSection.includes('Success Probability')) {
            dynamicSections[currentSection] = [...currentItems]
          }
        }
        
        // Start new section
        currentSection = headingMatch[1].trim()
        currentItems = []
        continue
      }
      
      // If we're in a section, collect content lines
      if (currentSection && line) {
        // Clean up the line - remove bullets, emojis, extra formatting
        const cleanLine = line
          .replace(/^[-•✅⚠️🟢🟡🔴]\s*/, '')
          .replace(/^\*\s*/, '')
          .replace(/^-\s*/, '')
          .trim()
        
        // Skip empty lines, lines that are just formatting, or lines starting with **
        if (cleanLine && 
            !cleanLine.startsWith('**') && 
            cleanLine.length > 3 &&
            !cleanLine.match(/^[🟢🟡🔴]\s*\*\*/) &&
            !cleanLine.match(/^\*\*Success Probability/)) {
          currentItems.push(cleanLine)
        }
      }
    }
    
    // Don't forget the last section
    if (currentSection && currentItems.length > 0) {
      if (!currentSection.includes('Patient Vital Signs') && 
          !currentSection.includes('Risk Assessment') &&
          !currentSection.includes('Success Probability')) {
        dynamicSections[currentSection] = currentItems
      }
    }
    
    // Extract timeline data with better patterns
    const hospitalStayMatch = aiText.match(/Hospital stay:\s*([^\n]+)/i) || 
                             aiText.match(/- Hospital stay:\s*([^\n]+)/i)
    const fullRecoveryMatch = aiText.match(/Full recovery:\s*([^\n]+)/i) || 
                             aiText.match(/- Full recovery:\s*([^\n]+)/i)
    const returnActivitiesMatch = aiText.match(/Return to activities:\s*([^\n]+)/i) || 
                                 aiText.match(/- Return to activities:\s*([^\n]+)/i)
    const durationMatch = aiText.match(/Surgery duration:\s*([^\n]+)/i) || 
                         aiText.match(/Estimated duration:\s*([^\n]+)/i) ||
                         aiText.match(/Duration:\s*([^\n]+)/i)
    
    return {
      riskLevel,
      riskScore,
      successRate,
      fullAnalysis: aiText,
      operation,
      vitalSigns,
      dynamicSections, // New dynamic sections
      timeline: {
        hospitalStay: hospitalStayMatch ? hospitalStayMatch[1].trim() : '2-3 days',
        fullRecovery: fullRecoveryMatch ? fullRecoveryMatch[1].trim() : '6-12 weeks',
        returnToActivities: returnActivitiesMatch ? returnActivitiesMatch[1].trim() : '3-6 months',
        duration: durationMatch ? durationMatch[1].trim() : '2-3h'
      }
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background grid-pattern flex items-center justify-center">
        <Card className="w-96 medical-glow">
          <CardContent className="p-8 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-4 border-primary/20 rounded-full mx-auto"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="h-8 w-8 text-primary animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Analysis in Progress</h3>
            <p className="text-muted-foreground mb-4">Connecting to Akash Network...</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <span>Processing medical data with Llama-3.1-405B...</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <span>Analyzing surgical risk factors...</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-chart-4 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <span>Generating recommendations...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background grid-pattern flex items-center justify-center">
        <Card className="w-96 medical-glow border-destructive/50">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-destructive">Analysis Failed</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
              <Link href="/patient">
                <Button>Return to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No data state
  if (!patientData || !analysisResult) {
    return (
      <div className="min-h-screen bg-background grid-pattern flex items-center justify-center">
        <Card className="w-96 medical-glow">
          <CardContent className="p-8 text-center">
            <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Analysis Data</h3>
            <p className="text-muted-foreground mb-6">Please run an analysis first from the patient dashboard.</p>
            <Link href="/patient">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/patient">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patient Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Surgical Risk Analysis</h1>
              <p className="text-sm text-muted-foreground">
                Analysis for: {proposedOperation || "Surgical Procedure"} • Patient: {patientData.patientName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="medical-glow-green">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Patient Info Banner */}
          <Card className="medical-glow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center medical-glow">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{patientData.patientName}</h2>
                  <p className="text-muted-foreground">ID: {patientData.patientId} • Age: {patientData.age} • Gender: {patientData.gender}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Proposed Procedure</div>
                  <div className="font-semibold text-lg">{proposedOperation}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analyzed Vital Signs - Full Width */}
          <Card className="medical-glow-green">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-destructive" />
                AI-Analyzed Vital Signs
              </CardTitle>
              <CardDescription>Real-time analysis of patient vital parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {analysisResult.vitalSigns && analysisResult.vitalSigns.length > 0 ? (
                  analysisResult.vitalSigns.map((vital: any, index: number) => (
                    <div key={index} className="p-4 bg-gradient-to-br from-card/80 to-card/40 rounded-xl border border-border/50 hover:border-secondary/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-foreground">{vital.name}</span>
                        <Badge variant="secondary" className="text-xs bg-secondary/20 text-secondary border-secondary/30">
                          ✅ Normal
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-foreground mb-1">{vital.value}</div>
                      <div className="text-xs text-muted-foreground">Status: {vital.status}</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No vital signs data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Akash AI Analysis - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Key Metrics */}
            <Card className="medical-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  Akash AI Analysis Summary
                </CardTitle>
                <CardDescription>Key metrics from AI assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center p-6 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl border border-secondary/30">
                      <div className="text-3xl font-bold text-secondary mb-2">{analysisResult.successRate}%</div>
                      <div className="text-sm text-muted-foreground">Success Probability</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/30">
                      <div className={`text-3xl font-bold mb-2 ${
                        analysisResult.riskLevel === 'low' ? 'text-secondary' :
                        analysisResult.riskLevel === 'moderate' ? 'text-chart-4' : 'text-destructive'
                      }`}>
                        {analysisResult.riskLevel === 'low' ? 'A+' :
                         analysisResult.riskLevel === 'moderate' ? 'B+' : 'C+'}
                      </div>
                      <div className="text-sm text-muted-foreground">Risk Grade</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-chart-4/20 to-chart-4/10 rounded-xl border border-chart-4/30">
                      <div className="text-3xl font-bold text-chart-4 mb-2">{analysisResult.riskScore}%</div>
                      <div className="text-sm text-muted-foreground">Risk Score</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="text-center pt-4">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="w-full border-primary/30 hover:bg-primary/10"
                      onClick={() => {
                        const newWindow = window.open('', '_blank')
                        if (newWindow) {
                          newWindow.document.write(`
                            <html>
                              <head><title>Full AI Analysis Report</title></head>
                              <body style="font-family: monospace; padding: 20px; line-height: 1.6;">
                                <h1>Akash AI Medical Analysis</h1>
                                <h2>Patient: ${patientData.patientName}</h2>
                                <h3>Procedure: ${proposedOperation}</h3>
                                <hr>
                                <pre>${analysisResult.fullAnalysis}</pre>
                              </body>
                            </html>
                          `)
                          newWindow.document.close()
                        }
                      }}
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      View Complete AI Analysis Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Dynamic Recommendations */}
            <div className="space-y-6">
              <DynamicRecommendations 
                dynamicSections={analysisResult.dynamicSections || {}} 
                timeline={analysisResult.timeline || {}}
              />
            </div>
          </div>

          {/* Risk Factors - Full Width */}
          <RiskFactors />

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6">
            <Button 
              size="lg" 
              className="px-8 medical-glow-green"
              onClick={() => exportToPDF()}
            >
              <FileText className="mr-2 h-5 w-5" />
              Export PDF Report
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8"
              onClick={() => shareReport()}
            >
              <Share className="mr-2 h-5 w-5" />
              Share Report
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8"
              onClick={() => downloadJSON()}
            >
              <Zap className="mr-2 h-5 w-5" />
              Export Data
            </Button>
            <Link href="/patient">
              <Button size="lg" variant="outline" className="px-8">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
