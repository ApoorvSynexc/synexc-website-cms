/**
 * A file stored by the backend. Other records reference it by `id` (e.g. blog.featuredImageId); when they are read
 * back the API embeds this object, with `url` / `thumbnailUrl` already turned into full URLs.
 */
export type Media = {
  id: string
  name: string
  size: number
  mimetype: string
  url: string
  /** Images only (null for SVG / PDF). */
  thumbnailUrl: string | null
}
