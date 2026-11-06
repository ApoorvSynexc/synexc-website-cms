import type { Media } from '../media/types'
import { createContentCollection } from '../website-content/collection'

/** Albums shown on the website. */
export const GALLERY_ALBUMS = ['Life at Synexc', 'Bharat Dreamin 2026'] as const

export type GalleryImage = {
  id: string
  imageId: string
  /** The photo (an uploaded file). */
  image: Media
  caption: string
  album: string
  isActive: boolean
}

export type GalleryImageInput = {
  /** Id of an uploaded file (see useMedia). */
  imageId: string
  caption: string
  album: string
  isActive: boolean
}

export const useGallery = createContentCollection<GalleryImage, GalleryImageInput>({
  key: 'gallery',
  path: 'gallery-image',
  fromApi: ({ status, ...row }) =>
    ({ ...row, caption: (row.caption as string | null) ?? '', isActive: status === 'ACTIVE' }) as unknown as GalleryImage,
})
