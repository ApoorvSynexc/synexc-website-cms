import { createContentCollection } from '../website-content/collection'

export type PartnerLogoPlacement = 'PARTNER' | 'CLIENT'

export type PartnerLogo = {
  id: string
  name: string
  /** Logo: http(s) URL or a site path. */
  logo: string
  /** Optional link to the partner / client site. */
  link: string
  /** PARTNER = "Our Trusted Partners" strip, CLIENT = client logos. */
  placement: PartnerLogoPlacement
  isActive: boolean
}

// Seeded from the logos in the website's "Our Trusted Partners" slider.
export const usePartnerLogo = createContentCollection<PartnerLogo>('partner-logos', [
  { id: 'p1', name: 'AWS', logo: '/client-logo/aws1.png', link: '', placement: 'PARTNER', isActive: true },
  { id: 'p2', name: 'Zoho', logo: '/client-logo/Zoho_Corporation-Logo.wine.svg', link: '', placement: 'PARTNER', isActive: true },
  { id: 'p3', name: 'HubSpot', logo: '/client-logo/download (1).png', link: '', placement: 'PARTNER', isActive: true },
  { id: 'p4', name: 'Tableau', logo: '/services/tableau-logo.png', link: '', placement: 'PARTNER', isActive: true },
  { id: 'p5', name: 'Salesforce', logo: '/client-logo/SalesforceLogo.png', link: '', placement: 'PARTNER', isActive: true },
  { id: 'p6', name: 'MuleSoft', logo: '/client-logo/MuleSoft-Logo.wine.png', link: '', placement: 'PARTNER', isActive: true },
])
