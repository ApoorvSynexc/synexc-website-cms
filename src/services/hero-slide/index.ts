import type { Media } from '../media/types'
import { createContentCollection } from '../website-content/collection'

export type HeroSlide = {
  id: string
  category: string
  title: string
  description: string
  imageId: string
  /** Banner image (an uploaded file). */
  image: Media
  logoId: string | null
  /** Optional partner logo shown on the slide. */
  logo: Media | null
  /** Optional page the slide links to ('' if none). */
  link: string
  isActive: boolean
}

export type HeroSlideInput = {
  category: string
  title: string
  description: string
  /** Id of an uploaded file (see useMedia). */
  imageId: string
  logoId: string | null
  link: string
  isActive: boolean
}

export const useHeroSlide = createContentCollection<HeroSlide, HeroSlideInput>({
  key: 'hero-slides',
  path: 'hero-slide',
  fromApi: ({ status, ...row }) =>
    ({ ...row, link: (row.link as string | null) ?? '', isActive: status === 'ACTIVE' }) as unknown as HeroSlide,
})
