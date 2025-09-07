import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from "@supabase/supabase-js"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Supabase Client
const supabaseUrl = 'https://bxdlohychhjnsngqfkho.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4ZGxvaHljaGhqbnNuZ3Fma2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMDgxOTUsImV4cCI6MjA3MjU4NDE5NX0.xERC4psgSHPqvYV2JflyJorKmMwPSko7TGbYydLscu4'

if (!supabaseUrl || !supabaseKey) {
}

export const supabase = createClient(supabaseUrl, supabaseKey)
