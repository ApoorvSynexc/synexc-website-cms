import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useHttpClient } from '../../hooks/useHttpClient'
import type { Profile } from './types'

export type { Profile } from './types'

export const accountKeys = {
  all: ['account'] as const,
  myProfile: () => [...accountKeys.all, 'my-profile'] as const,
}

export function useAccount() {
  const http = useHttpClient()
  const queryClient = useQueryClient()

  const myProfile = useQuery({
    queryKey: accountKeys.myProfile(),
    queryFn: async () => (await http.get<Profile>('/v1/account/my-profile')).data,
    retry: false,
  })

  /** Name and photo. `avatarId: null` removes the photo. */
  const updateProfile = useMutation({
    mutationFn: (body: { name: string; avatarId: string | null }) => http.put<Profile>('/v1/account/my-profile', body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: accountKeys.myProfile() }),
  })

  /** Signs out the user's other devices; this one stays signed in. */
  const changePassword = useMutation({
    mutationFn: (body: { currentPassword: string; newPassword: string }) =>
      http.put<null>('/v1/account/change-password', body),
  })

  return { myProfile, updateProfile, changePassword }
}
