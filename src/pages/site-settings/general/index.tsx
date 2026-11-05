import { useEffect, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button, ModuleHeader, TextField, Typography } from '../../../components'
import { useSession } from '../../../hooks'
import { getErrorMessage } from '../../../lib'
import { useSiteSettings, type SiteSettings } from '../../../services'
import { siteSettingsSchema } from './validations'

export default function GeneralSettingsModule() {
  const { can } = useSession()
  const canEdit = can('site_settings', 'update')
  const { getSettings, updateSettings } = useSiteSettings()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<SiteSettings>({ resolver: joiResolver(siteSettingsSchema) })

  useEffect(() => {
    if (getSettings.data) reset(getSettings.data)
  }, [getSettings.data, reset])

  const addressLength = watch('address')?.length ?? 0

  const onSubmit = (values: SiteSettings) => updateSettings.mutate(values)

  if (getSettings.isLoading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-2" />
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <ModuleHeader
        title="General Settings"
        description="Contact details, address, social links and footer text used across the website."
        action={
          canEdit && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!isDirty || updateSettings.isPending}
                onClick={() => getSettings.data && reset(getSettings.data)}
              >
                Reset
              </Button>
              <Button type="submit" size="sm" loading={updateSettings.isPending} disabled={!isDirty}>
                Save Changes
              </Button>
            </div>
          )
        }
      />

      {!canEdit && (
        <div className="mb-4 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-body">
          You have view-only access to these settings.
        </div>
      )}
      {updateSettings.isError && (
        <Typography variant="body-sm" className="mb-4 text-red-500">
          {getErrorMessage(updateSettings.error)}
        </Typography>
      )}
      {updateSettings.isSuccess && !isDirty && (
        <Typography variant="body-sm" className="mb-4 text-emerald-600">
          Settings saved.
        </Typography>
      )}

      <fieldset disabled={!canEdit} className="flex flex-col gap-6">
        <Section title="Contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Phone" required error={errors.phone?.message} {...register('phone')} />
            <TextField
              label="Phone hours"
              placeholder="Available 10 AM - 7 PM IST"
              error={errors.phoneHours?.message}
              {...register('phoneHours')}
            />
            <TextField label="Email" type="email" required error={errors.email?.message} {...register('email')} />
            <TextField
              label="Email note"
              placeholder="We usually respond within 24 hours"
              error={errors.emailNote?.message}
              {...register('emailNote')}
            />
            <TextField
              label="WhatsApp number"
              placeholder="919910189504"
              helperText="Digits only, with country code. Used by the floating WhatsApp button."
              error={errors.whatsapp?.message}
              {...register('whatsapp')}
            />
          </div>
        </Section>

        <Section title="Office address">
          <TextField
            label="Company name"
            required
            error={errors.companyName?.message}
            {...register('companyName')}
          />
          <div>
            <label htmlFor="ss-address" className="mb-1.5 block text-sm font-medium text-heading">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="ss-address"
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors placeholder:text-body/60 focus:border-accent disabled:opacity-60"
              {...register('address')}
            />
            <div className="mt-1 flex justify-between text-xs">
              <span className="text-red-500">{errors.address?.message ?? ''}</span>
              <span className={addressLength > 300 ? 'text-red-500' : 'text-body'}>{addressLength}/300</span>
            </div>
          </div>
        </Section>

        <Section title="Social links">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Facebook"
              placeholder="https://facebook.com/…"
              error={errors.facebook?.message}
              {...register('facebook')}
            />
            <TextField
              label="LinkedIn"
              placeholder="https://linkedin.com/company/…"
              error={errors.linkedin?.message}
              {...register('linkedin')}
            />
            <TextField
              label="Instagram"
              placeholder="https://instagram.com/…"
              error={errors.instagram?.message}
              {...register('instagram')}
            />
          </div>
        </Section>

        <Section title="Footer">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Copyright name"
              helperText="Shown as “© 2026 <name>. All rights reserved.”"
              required
              error={errors.copyrightName?.message}
              {...register('copyrightName')}
            />
            <div />
            <TextField
              label="Privacy policy link"
              placeholder="/privacy-policy"
              error={errors.privacyUrl?.message}
              {...register('privacyUrl')}
            />
            <TextField
              label="Terms of service link"
              placeholder="/terms"
              error={errors.termsUrl?.message}
              {...register('termsUrl')}
            />
          </div>
        </Section>
      </fieldset>
    </form>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border p-4">
      <h3 className="text-sm font-semibold text-heading">{title}</h3>
      {children}
    </section>
  )
}
