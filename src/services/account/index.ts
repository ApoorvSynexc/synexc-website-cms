import { useQuery } from '@tanstack/react-query'
import { useHttpClient } from '../../hooks/useHttpClient'
import { USE_MOCK, delay, mockError } from '../../lib'
import { access, permissionIdsOf } from '../access-store'
import type { Profile } from './types'

export type { Profile } from './types'

export const accountKeys = {
  all: ['account'] as const,
  myProfile: () => [...accountKeys.all, 'my-profile'] as const,
}

const MOCK_SESSION_KEY = 'synexc-mock-session'
export const mockSession = {
  start: (userId: string) => localStorage.setItem(MOCK_SESSION_KEY, userId),
  end: () => localStorage.removeItem(MOCK_SESSION_KEY),
  userId: () => localStorage.getItem(MOCK_SESSION_KEY),
}

function getMockProfile(): Profile {
  const user = access.users.find((u) => u.id === mockSession.userId())
  if (!user || user.status !== 'ACTIVE') throw mockError('Unauthorized', 401)
  const role = access.roles.find((r) => r.id === user.roleId)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: role ? { name: role.name } : undefined,
    permissions: role ? permissionIdsOf(role) : [],
  }
}

export function useAccount() {
  const http = useHttpClient()

  const myProfile = useQuery({
    queryKey: accountKeys.myProfile(),
    queryFn: async () => {
      if (USE_MOCK) {
        await delay(200)
        return getMockProfile()
      }
      return (await http.get<Profile>('/v1/account/my-profile')).data
    },
    retry: false,
  })

  return { myProfile }
}
