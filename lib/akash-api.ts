// Akash Chat API integration for medical diagnosis
// Based on: https://akash.network/docs/guides/machine-learning/akash-chat-api/

export interface MedicalData { // Add export here
  // Current Vital Signs
  heartRate: string
  bloodPressure: string
  temperature: string
  bloodSugar: string
  energyLevel: string
  
  // Patient Demographics
  patientId: string
  patientName: string
  age: number
  gender: string
  
  // Medical History
  medicalHistory: Array<{
    date: string
    type: string
    description: string
    doctor: string
    status: string
    severity: string
  }>
  
  // Current Medications
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    startDate: string
    status: string
    purpose: string
  }>
  
  // Lab Results
  labResults: Array<{
    id: string
    date: string
    type: string
    status: string
    doctor: string
  }>
  
  // Blood Work Values
  bloodWork: Array<{
    test: string
    value: number
    normal: string
    status: string
  }>
  
  // Proposed Operation
  proposedOperation: string
}

interface AkashResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export class AkashMedicalAPI {
  private apiKey: string
  private baseUrl: string = "https://chatapi.akash.network/api/v1"
  private model: string = "Meta-Llama-3-1-405B-Instruct-FP8"

  constructor(apiKey?: string) {
    // Use provided API key or fallback to environment variable
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_AKASH_API_KEY || "sk-exok-Bx7HKLh9aNDV_H6jg"
  }

  async analyzeMedicalData(medicalData: MedicalData): Promise<string> {
    const prompt = `As a senior medical AI consultant, perform a comprehensive surgical risk assessment for the following patient. Analyze ALL available medical data and provide a detailed evaluation for the proposed procedure.

**PATIENT DEMOGRAPHICS:**
- Patient ID: ${medicalData.patientId}
- Name: ${medicalData.patientName}
- Age: ${medicalData.age}
- Gender: ${medicalData.gender}

**CURRENT VITAL SIGNS:**
- Heart Rate: ${medicalData.heartRate}
- Blood Pressure: ${medicalData.bloodPressure}
- Temperature: ${medicalData.temperature}
- Blood Sugar: ${medicalData.bloodSugar}
- Energy Level: ${medicalData.energyLevel}

**MEDICAL HISTORY:**
${medicalData.medicalHistory.map(history => 
  `- ${history.date}: ${history.description} (${history.type}) - ${history.status} - Severity: ${history.severity}`
).join('\n')}

**CURRENT MEDICATIONS:**
${medicalData.medications.map(med => 
  `- ${med.name} ${med.dosage} (${med.frequency}) - ${med.purpose} - Status: ${med.status}`
).join('\n')}

**LABORATORY RESULTS:**
${medicalData.labResults.map(lab => 
  `- ${lab.type} (${lab.date}): ${lab.status}`
).join('\n')}

**BLOOD WORK VALUES:**
${medicalData.bloodWork.map(blood => 
  `- ${blood.test}: ${blood.value} (Normal: ${blood.normal}) - Status: ${blood.status}`
).join('\n')}

**PROPOSED OPERATION/PROCEDURE:**
${medicalData.proposedOperation}

**COMPREHENSIVE ANALYSIS REQUIRED:**

1. **OVERALL HEALTH ASSESSMENT:**
   - Evaluate current vital signs against normal ranges
   - Assess impact of medical history on surgical risk
   - Analyze medication interactions and surgical implications
   - Review lab results for any abnormalities

2. **SURGICAL RISK ASSESSMENT:**
   - ASA (American Society of Anesthesiologists) Physical Status Classification
   - Specific risks related to proposed procedure
   - Impact of medical history on surgical outcome
   - Medication-related surgical considerations

3. **DETAILED RECOMMENDATIONS:**
   - PROCEED / POSTPONE / CONTRAINDICATED with clear reasoning
   - Specific precautions based on patient's medical profile
   - Pre-operative optimization requirements
   - Intra-operative monitoring needs
   - Post-operative care considerations

4. **RISK FACTORS IDENTIFIED:**
   - List all identified risk factors from medical history
   - Medication-related risks
   - Lab abnormalities that may affect surgery
   - Age and demographic considerations

5. **PRE-OPERATIVE PREPARATIONS:**
   - Specific tests or consultations needed
   - Medication adjustments required
   - Lifestyle modifications
   - Informed consent considerations

6. **SUCCESS PROBABILITY:**
   - Percentage likelihood of successful outcome
   - Expected recovery timeline
   - Potential complications to monitor

Format your response as a comprehensive medical report with clear sections, risk indicators (🟢 LOW RISK, 🟡 MODERATE RISK, 🔴 HIGH RISK), and actionable recommendations.`

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content: "You are a medical AI assistant specialized in surgical risk assessment and patient evaluation. Provide accurate, evidence-based medical advice while emphasizing that all recommendations should be reviewed by qualified medical professionals."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.3 // Lower temperature for more consistent medical responses
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data: AkashResponse = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('Akash API Error:', error)
      throw new Error('Failed to analyze medical data. Please try again.')
    }
  }

  // Simulate API call for development/demo purposes
  async simulateAnalysis(medicalData: MedicalData): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate different responses based on the operation type
    const operation = medicalData.proposedOperation.toLowerCase()
    
    if (operation.includes('cardiac') || operation.includes('heart')) {
      return this.generateCardiacAssessment(medicalData)
    } else if (operation.includes('knee') || operation.includes('joint')) {
      return this.generateOrthopedicAssessment(medicalData)
    } else if (operation.includes('brain') || operation.includes('neurological')) {
      return this.generateNeurologicalAssessment(medicalData)
    } else {
      return this.generateGeneralAssessment(medicalData)
    }
  }

  private generateCardiacAssessment(data: MedicalData): string {
    return `**CARDIAC SURGERY RISK ASSESSMENT**

**Patient Vital Signs Analysis:**
✅ Heart Rate: ${data.heartRate} (Optimal for cardiac procedures)
✅ Blood Pressure: ${data.bloodPressure} (Well-controlled)
✅ Temperature: ${data.temperature} (Normal)
✅ Blood Sugar: ${data.bloodSugar} (Normal range)
✅ Energy Level: ${data.energyLevel} (Good cardiovascular fitness)

**Cardiac Risk Assessment:**
🟢 **LOW-MODERATE RISK** - Patient presents with excellent cardiovascular parameters suitable for cardiac procedures.

**Specific Recommendations:**
✅ **PROCEED WITH CAUTION** - Patient is suitable for cardiac surgery with standard monitoring protocols.

**Pre-operative Requirements:**
- Complete cardiac catheterization
- Echocardiogram within 30 days
- Stress test evaluation
- Cardiology consultation
- Blood thinners management plan

**Intra-operative Monitoring:**
- Continuous ECG monitoring
- Arterial line placement
- Central venous pressure monitoring
- Transesophageal echocardiography

**Post-operative Care:**
- ICU monitoring for 24-48 hours
- Daily cardiac enzyme levels
- Chest X-ray monitoring
- Early mobilization protocol

**Risk Factors Identified:**
- Standard surgical risks apply
- No immediate contraindications based on current vitals

**Note:** This assessment is based on current vital signs only. Complete medical history and additional diagnostic tests are required for final surgical clearance.`
  }

  private generateOrthopedicAssessment(data: MedicalData): string {
    return `**ORTHOPEDIC SURGERY RISK ASSESSMENT**

**Patient Vital Signs Analysis:**
✅ Heart Rate: ${data.heartRate} (Normal range)
✅ Blood Pressure: ${data.bloodPressure} (Stable)
✅ Temperature: ${data.temperature} (No signs of infection)
✅ Blood Sugar: ${data.bloodSugar} (Normal - good for healing)
✅ Energy Level: ${data.energyLevel} (Good for rehabilitation)

**Orthopedic Risk Assessment:**
🟢 **LOW RISK** - Patient presents with excellent parameters for orthopedic procedures.

**Specific Recommendations:**
✅ **PROCEED** - Patient is an ideal candidate for orthopedic surgery.

**Pre-operative Preparations:**
- Physical therapy evaluation
- Pre-operative exercise program
- Weight optimization if needed
- Smoking cessation (if applicable)
- Dental clearance (for joint replacements)

**Surgical Considerations:**
- Standard antibiotic prophylaxis
- DVT prophylaxis protocol
- Regional anesthesia consideration
- Blood conservation techniques

**Post-operative Protocol:**
- Early mobilization within 24 hours
- Physical therapy starting day 1
- Pain management protocol
- Wound care monitoring
- Follow-up imaging schedule

**Recovery Timeline:**
- Hospital stay: 2-3 days
- Full recovery: 6-12 weeks
- Return to activities: 3-6 months

**Success Probability:** 95% based on current vital signs and energy level.`
  }

  private generateNeurologicalAssessment(data: MedicalData): string {
    return `**NEUROLOGICAL SURGERY RISK ASSESSMENT**

**Patient Vital Signs Analysis:**
✅ Heart Rate: ${data.heartRate} (Stable cardiovascular status)
✅ Blood Pressure: ${data.bloodPressure} (Well-controlled - critical for brain surgery)
✅ Temperature: ${data.temperature} (Normal - no infection risk)
✅ Blood Sugar: ${data.bloodSugar} (Normal - optimal for brain function)
✅ Energy Level: ${data.energyLevel} (Good baseline for recovery)

**Neurological Risk Assessment:**
🟡 **MODERATE RISK** - Neurological procedures require careful evaluation despite good vitals.

**Specific Recommendations:**
⚠️ **PROCEED WITH EXTREME CAUTION** - Requires comprehensive neurological evaluation.

**Pre-operative Requirements:**
- Complete neurological examination
- MRI/CT brain imaging
- Neuropsychological assessment
- Anesthesia consultation
- Blood coagulation studies
- Baseline cognitive testing

**Critical Considerations:**
- Blood pressure control is paramount
- Risk of neurological deficits
- Potential for cognitive changes
- Seizure risk assessment
- CSF leak monitoring

**Intra-operative Monitoring:**
- Continuous EEG monitoring
- Motor evoked potentials
- Somatosensory evoked potentials
- Intracranial pressure monitoring
- Arterial blood pressure control

**Post-operative Care:**
- Neurological checks every hour
- ICU monitoring for 48-72 hours
- Seizure prophylaxis
- CSF drainage monitoring
- Early rehabilitation assessment

**Risk Factors:**
- Standard neurosurgical risks
- Potential for permanent neurological deficits
- Extended recovery period

**Note:** Neurological surgery carries inherent risks regardless of vital signs. Comprehensive pre-operative evaluation is mandatory.`
  }

  private generateGeneralAssessment(data: MedicalData): string {
    return `**GENERAL SURGERY RISK ASSESSMENT**

**Patient Vital Signs Analysis:**
✅ Heart Rate: ${data.heartRate} (Normal range: 60-100 BPM)
✅ Blood Pressure: ${data.bloodPressure} (Normal)
✅ Temperature: ${data.temperature} (Normal - no infection)
✅ Blood Sugar: ${data.bloodSugar} (Normal range: 70-100 mg/dL)
✅ Energy Level: ${data.energyLevel} (Good baseline health)

**Overall Health Assessment:**
The patient presents with excellent vital signs across all parameters. All values are within normal ranges, indicating good overall health and surgical fitness.

**Risk Assessment for ${data.proposedOperation}:**
🟢 **LOW RISK** - Based on current vital signs, the patient appears to be in excellent health for the proposed procedure.

**Recommendations:**
✅ **PROCEED** - The patient's vital signs strongly support proceeding with the proposed operation. No immediate contraindications identified.

**Pre-operative Preparations:**
- Standard pre-operative blood work
- ECG and chest X-ray
- Anesthesia consultation
- Pre-operative fasting guidelines
- Medication review and adjustments
- Smoking cessation (if applicable)

**Surgical Considerations:**
- Standard surgical protocols apply
- No special monitoring requirements
- Normal anesthesia risk profile
- Expected good recovery potential

**Post-operative Care:**
- Standard post-operative monitoring
- Early mobilization encouraged
- Normal pain management protocol
- Regular vital sign monitoring
- Follow-up appointment scheduling

**Recovery Expectations:**
- Normal recovery timeline
- Good healing potential
- Low complication risk
- Early return to activities

**Success Probability:** 98% based on excellent vital signs and high energy level.

**Additional Notes:**
The patient's stable vital signs and high energy level (${data.energyLevel}) suggest excellent overall health and recovery potential. Regular monitoring during the procedure is recommended as standard practice.`
  }
}

// Export a default instance with your API key
export const akashAPI = new AkashMedicalAPI("sk-exok-Bx7HKLh9aNDV_H6jg")
