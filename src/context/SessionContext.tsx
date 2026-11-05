import { createContext, type ReactNode } from 'react'
import { useAccount, type Profile } from '../services/account'
import { SplashScreen } from '../components'

export type SessionContextValue = {
  user: Profile | null
  isAuthenticated: boolean
  /** True if the user's role grants `<subject>:<action>`, e.g. can('blog', 'create'). */
  can: (subject: string, action: string) => boolean
}

// eslint-disable-next-line react-refresh/only-export-components
export const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const { myProfile } = useAccount()
  const { data: user, isLoading, isError } = myProfile

  // Block the whole app on the initial session check — no route (protected
  // or public) should render until we know whether my-profile succeeds.
  if (isLoading) return <SplashScreen />

  const permissions = new Set(user?.permissions ?? [])
  const value: SessionContextValue = {
    user: user ?? null,
    isAuthenticated: Boolean(user) && !isError,
    can: (subject, action) => permissions.has(`${subject}:${action}`),
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
