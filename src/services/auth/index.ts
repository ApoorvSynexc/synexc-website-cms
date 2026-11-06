import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useHttpClient } from '../../hooks'
import { accountKeys } from '../account'
import type { LoginCredentials } from './types'

export type { LoginCredentials } from './types'

export function useAuth() {
  const http = useHttpClient()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const login = useMutation({
    mutationFn: (credentials: LoginCredentials) => http.post<{ user: { id: string } }>('/v1/auth/login', credentials),
    // Session auth: the backend sets httpOnly cookies, so there is nothing to store. Refetch my-profile and wait for
    // it — that way ProtectedRoute already sees an authenticated session when the login page navigates away.
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: accountKeys.myProfile() })
    },
  })

  const logout = useMutation({
    mutationFn: () => http.post<null>('/v1/auth/logout'),
    onSettled: () => {
      // Even if the request failed, drop everything cached for this user and go to the login page.
      queryClient.clear()
      navigate('/login', { replace: true })
    },
  })

  return { login, logout }
}
