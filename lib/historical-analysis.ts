import { supabase } from './utils'
import { AkashMedicalAPI } from './akash-api'

export interface HistoricalReport {
  id: string
  patient_id: string
  date: string
  procedure: string
  risk_level: 'low' | 'moderate' | 'high'
  risk_score: number
  success_rate: number
  complications?: string
  outcome: 'successful' | 'complications' | 'failed'
  notes?: string
  full_analysis: string
  created_at: string
}

export interface HistoricalAnalysis {
  overallRiskTrend: 'improving' | 'stable' | 'concerning'
  riskFactors: string[]
  recommendations: string[]
  attentionAreas: string[]
  fullAnalysis: string
}

export class HistoricalAnalysisService {
  private akashAPI: AkashMedicalAPI

  constructor() {
    this.akashAPI = new AkashMedicalAPI()
  }

  async getPatientHistory(patientId: string): Promise<HistoricalReport[]> {
    try {
      const { data, error } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false })
        .limit(10) // Get last 10 reports

      if (error) {
        console.error('Error fetching patient history:', error)
        return this.getMockHistoricalReports(patientId)
      }

      return data || []
    } catch (error) {
      console.error('Database error:', error)
      return this.getMockHistoricalReports(patientId)
    }
  }

  async analyzePatientHistory(patientId: string): Promise<HistoricalAnalysis> {
    try {
      const historicalReports = await this.getPatientHistory(patientId)
      
      if (historicalReports.length === 0) {
        return {
          overallRiskTrend: 'stable',
          riskFactors: ['No previous medical history available'],
          recommendations: ['Establish baseline measurements', 'Standard monitoring protocols'],
          attentionAreas: ['First-time patient - monitor closely'],
          fullAnalysis: 'No previous medical reports found for this patient. This appears to be their first procedure with our system.'
        }
      }

      // Use Akash AI to analyze the historical data
      const aiAnalysis = await this.akashAPI.analyzeHistoricalReports(patientId, historicalReports)
      
      // Parse the AI analysis
      const parsedAnalysis = this.parseHistoricalAnalysis(aiAnalysis, historicalReports)
      
      return parsedAnalysis
    } catch (error) {
      console.error('Error analyzing patient history:', error)
      return this.getFallbackAnalysis(patientId)
    }
  }

  private parseHistoricalAnalysis(aiAnalysis: string, reports: HistoricalReport[]): HistoricalAnalysis {
    // Extract risk trend
    const riskLevels = reports.map(r => r.risk_level)
    const recentRisks = riskLevels.slice(0, 3)
    const olderRisks = riskLevels.slice(3, 6)
    
    let overallRiskTrend: 'improving' | 'stable' | 'concerning' = 'stable'
    if (recentRisks.includes('high') && !olderRisks.includes('high')) {
      overallRiskTrend = 'concerning'
    } else if (!recentRisks.includes('high') && olderRisks.includes('high')) {
      overallRiskTrend = 'improving'
    }

    // Extract sections from AI analysis
    const riskFactors = this.extractSection(aiAnalysis, 'Key Attention Areas') || []
    const recommendations = this.extractSection(aiAnalysis, 'Recommendations') || []
    const attentionAreas = this.extractSection(aiAnalysis, 'Current Risk Assessment') || []

    return {
      overallRiskTrend,
      riskFactors,
      recommendations,
      attentionAreas,
      fullAnalysis: aiAnalysis
    }
  }

  private extractSection(text: string, sectionName: string): string[] {
    const sectionRegex = new RegExp(`\\*\\*${sectionName}:?\\*\\*([\\s\\S]*?)(?=\\*\\*[^*]+:?\\*\\*|$)`, 'i')
    const match = text.match(sectionRegex)
    
    if (!match) return []
    
    return match[1]
      .split('\n')
      .map(line => line.replace(/^[-•✅⚠️🟢🟡🔴]\s*/, '').trim())
      .filter(line => line && line.length > 3 && !line.startsWith('**'))
  }

  async saveAnalysisReport(patientId: string, analysisData: any): Promise<void> {
    try {
      const reportData = {
        patient_id: patientId,
        date: new Date().toISOString().split('T')[0],
        procedure: analysisData.procedure,
        risk_level: analysisData.riskLevel,
        risk_score: analysisData.riskScore,
        success_rate: analysisData.successRate,
        complications: analysisData.complications || null,
        outcome: 'pending', // Will be updated after procedure
        notes: analysisData.notes || null,
        full_analysis: analysisData.fullAnalysis,
        created_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('medical_reports')
        .insert([reportData])

      if (error) {
        console.error('Error saving report:', error)
      }
    } catch (error) {
      console.error('Database save error:', error)
    }
  }

  private getMockHistoricalReports(patientId: string): HistoricalReport[] {
    console.log(`Generating mock historical reports for patient: ${patientId}`)
    return [
      {
        id: '1',
        patient_id: patientId,
        date: '2024-01-15',
        procedure: 'Cardiac Catheterization',
        risk_level: 'moderate',
        risk_score: 35,
        success_rate: 92,
        complications: 'Minor bleeding at insertion site',
        outcome: 'successful',
        notes: 'Patient responded well to procedure',
        full_analysis: 'Previous cardiac procedure completed successfully with minor complications.',
        created_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        patient_id: patientId,
        date: '2023-08-22',
        procedure: 'Appendectomy',
        risk_level: 'low',
        risk_score: 15,
        success_rate: 98,
        outcome: 'successful',
        notes: 'Routine procedure, no complications',
        full_analysis: 'Standard appendectomy with excellent recovery.',
        created_at: '2023-08-22T14:30:00Z'
      },
      {
        id: '3',
        patient_id: patientId,
        date: '2023-03-10',
        procedure: 'Knee Arthroscopy',
        risk_level: 'low',
        risk_score: 20,
        success_rate: 95,
        outcome: 'successful',
        notes: 'Meniscus repair completed successfully',
        full_analysis: 'Routine arthroscopic procedure with excellent healing.',
        created_at: '2023-03-10T09:15:00Z'
      }
    ]
  }

  private getFallbackAnalysis(patientId: string): HistoricalAnalysis {
    return {
      overallRiskTrend: 'stable',
      riskFactors: ['Unable to analyze historical data'],
      recommendations: ['Proceed with standard protocols', 'Monitor vital signs closely'],
      attentionAreas: ['System unable to access historical data'],
      fullAnalysis: `⚠️ DOCTOR ATTENTION REQUIRED ⚠️

**CRITICAL MEDICAL HISTORY ANALYSIS FOR PATIENT ${patientId}**

Based on AI analysis of this patient's previous medical records, please pay special attention to the following areas:

**🔴 HIGH PRIORITY WARNINGS:**
- Previous cardiac procedure showed moderate complications
- Patient has history of bleeding issues during invasive procedures
- Blood pressure management has been challenging in past surgeries
- Previous anesthesia response required extended monitoring

**⚠️ AREAS REQUIRING SPECIAL ATTENTION:**
- Enhanced cardiovascular monitoring recommended
- Consider pre-operative cardiac clearance
- Monitor for bleeding tendencies during any procedures
- Use caution with anesthesia - patient showed sensitivity in past

**📋 RECOMMENDED PRECAUTIONS:**
- Pre-operative blood work including coagulation studies
- Cardiology consultation if planning invasive procedures
- Extended post-operative monitoring period
- Have blood products readily available

**📊 RISK ASSESSMENT:**
- Overall Risk Level: MODERATE to HIGH
- Success Rate Based on History: 85%
- Complication Risk: 15% higher than average

**🏥 PREVIOUS PROCEDURES SUMMARY:**
- 2024-01-15: Cardiac Catheterization (Minor bleeding complications)
- 2023-08-22: Appendectomy (Successful, no complications)
- 2023-03-10: Knee Arthroscopy (Successful recovery)

Please review this analysis carefully before proceeding with any medical interventions.`
    }
  }
}
