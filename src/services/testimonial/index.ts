import type { Media } from '../media/types'
import { createContentCollection } from '../website-content/collection'

/** Website pages a testimonial can appear on. */
export const TESTIMONIAL_PAGES = [
  { value: 'home', label: 'Home' },
  { value: 'about', label: 'About us' },
  { value: 'culture', label: 'Culture' },
  { value: 'case-studies', label: 'Case studies' },
  { value: 'industries', label: 'Industries' },
] as const

export type Testimonial = {
  id: string
  name: string
  /** e.g. "CEO, TechFlow Solutions" or just the company. */
  role: string
  message: string
  avatarId: string | null
  /** Client logo / photo (an uploaded file, optional). */
  avatar: Media | null
  pages: string[]
  isActive: boolean
}

export type TestimonialInput = {
  name: string
  role: string
  message: string
  avatarId: string | null
  pages: string[]
  isActive: boolean
}

export const useTestimonial = createContentCollection<Testimonial, TestimonialInput>({
  key: 'testimonials',
  path: 'testimonial',
})
