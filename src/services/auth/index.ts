import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useHttpClient } from '../../hooks'
import { USE_MOCK, delay, mockError } from '../../lib'
import { accountKeys, mockSession } from '../account'
import { access } from '../access-store'
import type { AuthResponse, LoginCredentials } from './types'

export type { LoginCredentials, AuthResponse } from './types'

export function useAuth() {
  const http = useHttpClient()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      if (USE_MOCK) {
        await delay()
        const user = access.users.find(
          (u) => u.email.toLowerCase() === credentials.email.trim().toLowerCase(),
        )
        if (!user || user.password !== credentials.password) {
          throw mockError('Invalid email or password', 401)
        }
        if (user.status !== 'ACTIVE') throw mockError('This account is deactivated', 403)
        mockSession.start(user.id)
        return
      }
      await http.post<AuthResponse>('/v1/auth/login', credentials)
    },
    // Session auth: the backend sets an httpOnly cookie, so just refetch
    // my-profile — awaiting it keeps ProtectedRoute from bouncing back to /login.
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: accountKeys.myProfile() })
    },
  })

  const logout = useMutation({
    mutationFn: async () => {
      if (USE_MOCK) {
        mockSession.end()
        return
      }
      await http.post<void>('/v1/auth/logout')
    },
    onSuccess: () => {
      queryClient.clear()
      navigate('/login', { replace: true })
    },
  })

  return { login, logout }
}
