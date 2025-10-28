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
 * Validates and trims user input strings
 * Note: This function only validates and trims. DO NOT apply HTML encoding for database storage.
 * HTML encoding should only be applied when rendering to prevent XSS.
 * @param input - Raw user input string
 * @returns Trimmed and validated string
 */
export function validateInput(input: string): string {
  if (typeof input !== 'string') return ''
  return input.trim()
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
