import type { Media } from '../media/types'
import { createContentCollection } from '../website-content/collection'

export type PartnerLogoPlacement = 'PARTNER' | 'CLIENT'

export type PartnerLogo = {
  id: string
  name: string
  logoId: string
  /** The logo (an uploaded file). */
  logo: Media
  /** Optional link to the partner / client site ('' if none). */
  link: string
  /** PARTNER = "Our Trusted Partners" strip, CLIENT = client logos. */
  placement: PartnerLogoPlacement
  isActive: boolean
}

export type PartnerLogoInput = {
  name: string
  /** Id of an uploaded file (see useMedia). */
  logoId: string
  link: string
  placement: PartnerLogoPlacement
  isActive: boolean
}

export const usePartnerLogo = createContentCollection<PartnerLogo, PartnerLogoInput>({
  key: 'partner-logos',
  path: 'partner-logo',
  fromApi: ({ status, ...row }) =>
    ({ ...row, link: (row.link as string | null) ?? '', isActive: status === 'ACTIVE' }) as unknown as PartnerLogo,
})
