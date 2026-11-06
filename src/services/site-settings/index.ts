import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useHttpClient } from '../../hooks/useHttpClient'

/** Company-wide details the website repeats in the header, footer and contact page. */
export type SiteSettings = {
  phone: string
  /** Shown under the phone number on the contact page. */
  phoneHours: string
  email: string
  emailNote: string
  /** WhatsApp number with country code, digits only. */
  whatsapp: string
  companyName: string
  /** One line per row, shown in the footer "Visit us" block. */
  address: string
  facebook: string
  linkedin: string
  instagram: string
  /** Name shown after the © in the footer. */
  copyrightName: string
  privacyUrl: string
  termsUrl: string
}

export const siteSettingsKey = ['site-settings'] as const

const FIELDS: (keyof SiteSettings)[] = [
  'phone',
  'phoneHours',
  'email',
  'emailNote',
  'whatsapp',
  'companyName',
  'address',
  'facebook',
  'linkedin',
  'instagram',
  'copyrightName',
  'privacyUrl',
  'termsUrl',
]

/** Keeps only the editable fields and turns the API's nulls into '' so form inputs stay controlled. */
const fromApi = (raw: Partial<Record<keyof SiteSettings, string | null>>): SiteSettings =>
  Object.fromEntries(FIELDS.map((key) => [key, raw[key] ?? ''])) as SiteSettings

export function useSiteSettings() {
  const http = useHttpClient()
  const queryClient = useQueryClient()

  const getSettings = useQuery({
    queryKey: siteSettingsKey,
    queryFn: async () => fromApi((await http.get<Partial<Record<keyof SiteSettings, string | null>>>('/v1/site-setting')).data),
  })

  const updateSettings = useMutation({
    mutationFn: (input: SiteSettings) => http.put('/v1/site-setting', input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: siteSettingsKey }),
  })

  return { getSettings, updateSettings }
}
