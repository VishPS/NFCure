'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { 
  History, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  Activity,
  Heart
} from "lucide-react"
import { HistoricalAnalysisService } from "@/lib/historical-analysis"
import type { HistoricalAnalysis } from "@/lib/historical-analysis"

interface HistoricalAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  patientId: string
  patientName: string
  onProceedToDiagnosis: () => void
}

export default function HistoricalAnalysisModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  onProceedToDiagnosis
}: HistoricalAnalysisModalProps) {
  const [analysis, setAnalysis] = useState<HistoricalAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const historicalService = new HistoricalAnalysisService()

  useEffect(() => {
    if (isOpen && patientId) {
      analyzeHistory()
    }
  }, [isOpen, patientId])

  const analyzeHistory = async () => {
    console.log('Starting historical analysis for patient:', patientId)
    setLoading(true)
    setError(null)
    try {
      const result = await historicalService.analyzePatientHistory(patientId)
      console.log('Historical analysis result:', result)
      setAnalysis(result)
    } catch (err) {
      setError('Failed to analyze patient history')
      console.error('Analysis error:', err)
    }
    setLoading(false)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'concerning': return <TrendingDown className="h-5 w-5 text-red-500" />
      default: return <Activity className="h-5 w-5 text-blue-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600 bg-green-50 border-green-200'
      case 'concerning': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getTrendMessage = (trend: string) => {
    switch (trend) {
      case 'improving': return 'Patient\'s risk profile has been improving over time'
      case 'concerning': return 'Recent procedures show increasing risk factors - requires attention'
      default: return 'Patient maintains stable risk profile across procedures'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            ⚠️ CRITICAL: Historical Medical Analysis - {patientName}
          </DialogTitle>
          <DialogDescription className="text-amber-600 font-medium">
            🔍 AI has analyzed patient's medical history. Review these warnings before accessing patient records.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Analyzing patient history with Akash AI...</p>
              </div>
            </div>
          )}

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {analysis && !loading && (
            <ScrollArea className="h-[60vh]">
              <div className="space-y-6 pr-4">
                {/* Risk Trend Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getTrendIcon(analysis.overallRiskTrend)}
                      Risk Trend Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`p-4 rounded-lg border ${getTrendColor(analysis.overallRiskTrend)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Overall Trend</span>
                        <Badge variant={analysis.overallRiskTrend === 'improving' ? 'default' : 
                                     analysis.overallRiskTrend === 'concerning' ? 'destructive' : 'secondary'}>
                          {analysis.overallRiskTrend.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm">{getTrendMessage(analysis.overallRiskTrend)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Attention Areas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      Key Attention Areas
                    </CardTitle>
                    <CardDescription>
                      Factors requiring special attention based on medical history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.attentionAreas.map((area, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-orange-800">{area}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Factors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Historical Risk Factors
                    </CardTitle>
                    <CardDescription>
                      Recurring patterns and risk factors from previous procedures
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      {analysis.riskFactors.map((factor, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-card/50 border border-border/50 rounded-lg">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      AI Recommendations
                    </CardTitle>
                    <CardDescription>
                      Actionable recommendations based on historical analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-green-800">{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Full AI Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Complete AI Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-40">
                      <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed bg-card/50 p-4 rounded-lg">
                        {analysis.fullAnalysis}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t bg-amber-50 p-4 rounded-lg">
            <div className="text-sm text-amber-700">
              <AlertTriangle className="h-4 w-4 inline mr-2" />
              You must acknowledge these warnings before accessing patient records
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={analyzeHistory} disabled={loading}>
                <History className="h-4 w-4 mr-2" />
                Refresh Analysis
              </Button>
              
              <Button 
                onClick={onClose}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                I Understand - Access Patient Records
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
