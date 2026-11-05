import { Typography } from '../../components'
import General from './general'

export default function SiteSettingsPage() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="shrink-0">
        <Typography variant="h5">Site Settings</Typography>
        <Typography variant="body-sm" color="body" className="mt-0.5">
          Company details used across the website: contact info, address, social links and footer.
        </Typography>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-border bg-surface p-5">
        <General />
      </div>
    </div>
  )
}
