import type { ReactNode } from 'react'
import { FiLock } from 'react-icons/fi'
import { Typography } from '../components'
import { useSession } from '../hooks'

type PermissionRouteProps = {
  /** Every [subject, action] pair is accepted — the user needs at least one. */
  anyOf: [subject: string, action: string][]
  children: ReactNode
}

export function PermissionRoute({ anyOf, children }: PermissionRouteProps) {
  const { can } = useSession()

  if (!anyOf.some(([subject, action]) => can(subject, action))) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-body">
          <FiLock size={20} />
        </div>
        <Typography variant="h5">No access</Typography>
        <Typography variant="body-sm" color="body">
          Your role doesn&apos;t include permission to view this page. Ask an admin to update it.
        </Typography>
      </div>
    )
  }

  return children
}
