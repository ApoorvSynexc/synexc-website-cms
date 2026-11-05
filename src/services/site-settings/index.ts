import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { delay } from '../../lib'

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

// ---- Mock store (replace with http calls once the API is ready) ----
// Seeded from the values hardcoded in the website's footer, header and contact page.
let settings: SiteSettings = {
  phone: '+91 9810512585',
  phoneHours: 'Available 10 AM - 7 PM IST',
  email: 'contact@synexc.com',
  emailNote: 'We usually respond within 24 hours',
  whatsapp: '919910189504',
  companyName: 'Synexc IT Solutions LLP',
  address: 'Bhutani Cyber Park, Tower B, Block- C,\n6th Floor, Sector 62 Noida,\nUttar Pradesh 201309, India',
  facebook: 'https://www.facebook.com/profile.php?id=61573616079229',
  linkedin: 'https://www.linkedin.com/company/synexc/about/?viewAsMember=true',
  instagram: 'https://www.instagram.com/synexc_global/?next=%2F&hl=en',
  copyrightName: 'Synexc Technologies',
  privacyUrl: '/contact-us',
  termsUrl: '/contact-us',
}

export function useSiteSettings() {
  const queryClient = useQueryClient()

  const getSettings = useQuery({
    queryKey: siteSettingsKey,
    queryFn: async () => {
      await delay(250)
      return { ...settings }
    },
  })

  const updateSettings = useMutation({
    mutationFn: async (input: SiteSettings) => {
      await delay()
      settings = { ...input }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: siteSettingsKey }),
  })

  return { getSettings, updateSettings }
}
