import { ApiError } from './httpClient'

/**
 * UI-first mode: services return in-memory data instead of calling the API.
 * Set VITE_USE_MOCK=false in .env once the backend is ready — each service
 * keeps a clearly marked mock section to replace with http calls.
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export const delay = (ms = 350) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export const mockError = (message: string, status = 400) =>
  new ApiError(message, status, { message })

export const newId = () => crypto.randomUUID()
