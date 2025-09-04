import { supabase } from './utils'

export async function testDatabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('patients')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Database connection error:', error)
      return {
        connected: false,
        error: error.message,
        details: error
      }
    }
    
    console.log('Database connection successful!')
    return {
      connected: true,
      message: 'Successfully connected to Supabase',
      patientCount: data || 0
    }
    
  } catch (err) {
    console.error('Connection test failed:', err)
    return {
      connected: false,
      error: 'Failed to connect to database',
      details: err
    }
  }
}

export async function checkDatabaseTables() {
  try {
    // Check if patients table exists and get structure
    const { data: patients, error: patientsError } = await supabase
      .from('patients')
      .select('*')
      .limit(1)
    
    const results = {
      patients: {
        exists: !patientsError,
        error: patientsError?.message,
        sampleData: patients?.[0] || null
      }
    }
    
    return results
    
  } catch (err) {
    console.error('Table check failed:', err)
    return {
      error: 'Failed to check database tables',
      details: err
    }
  }
}
