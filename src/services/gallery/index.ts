import { createContentCollection } from '../website-content/collection'

/** Albums shown on the website. Add a name here (and on the site) to create a new album. */
export const GALLERY_ALBUMS = ['Life at Synexc', 'Bharat Dreamin 2026'] as const

export type GalleryImage = {
  id: string
  /** http(s) URL or a site path. */
  image: string
  caption: string
  album: string
  isActive: boolean
}

const photo = (id: string, image: string, album: string): GalleryImage => ({
  id,
  image,
  caption: '',
  album,
  isActive: true,
})

// Seeded from the image lists in the website's EventsAtSynexc component.
export const useGallery = createContentCollection<GalleryImage>('gallery', [
  photo('g1', '/about1.png', 'Life at Synexc'),
  photo('g2', '/about2.JPG', 'Life at Synexc'),
  photo('g3', '/about3.JPG', 'Life at Synexc'),
  photo('g4', '/about4.jpg', 'Life at Synexc'),
  photo('g5', '/about5.jpg', 'Life at Synexc'),
  photo('g6', '/about6.JPG', 'Life at Synexc'),
  photo('g7', '/about7.jpeg', 'Life at Synexc'),
  photo('g8', '/about9.jpeg', 'Life at Synexc'),
  photo('g9', '/about10.jpeg', 'Life at Synexc'),
  photo('g10', '/bharat-pic/1.png', 'Bharat Dreamin 2026'),
  photo('g11', '/bharat-pic/2.jpg', 'Bharat Dreamin 2026'),
  photo('g12', '/bharat-pic/3.jpg', 'Bharat Dreamin 2026'),
  photo('g13', '/bharat-pic/4.jpg', 'Bharat Dreamin 2026'),
  photo('g14', '/bharat-pic/5.jpg', 'Bharat Dreamin 2026'),
])
