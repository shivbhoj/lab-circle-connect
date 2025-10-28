import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names using clsx and tailwind-merge
 * @param inputs - Class names, objects, or arrays to be merged
 * @returns Merged and deduplicated class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Validates and trims user input strings with security checks
 * Note: This function validates and trims. DO NOT apply HTML encoding for database storage.
 * HTML encoding should only be applied when rendering to prevent XSS.
 * @param input - Raw user input string
 * @param maxLength - Maximum allowed length (default: 1000)
 * @returns Trimmed and validated string
 * @throws Error if input contains null bytes or exceeds maxLength
 */
export function validateInput(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') return ''
  
  const trimmed = input.trim()
  
  // Check for null bytes which can be used in injection attacks
  if (trimmed.includes('\0')) {
    throw new Error('Invalid input: contains null bytes')
  }
  
  // Check length
  if (trimmed.length > maxLength) {
    throw new Error(`Input exceeds maximum length of ${maxLength} characters`)
  }
  
  return trimmed
}

/**
 * Type guard to check if a value is a non-null object
 * @param value - Value to check
 * @returns True if value is a non-null object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Safely formats error messages from unknown error types
 * @param error - Error object or unknown value
 * @returns User-friendly error message
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (isObject(error) && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return 'An unexpected error occurred'
}
