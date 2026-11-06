/* eslint-disable react-refresh/only-export-components -- shared validators and small UI helpers live together */
import Joi from 'joi'

/** Image fields accept a full http(s) URL or a path on the website, e.g. /banners/banner-crm.jpg */
export const assetUrl = Joi.string()
  .trim()
  .pattern(/^(https?:\/\/\S+|\/\S+)$/)
  .allow('')
  .messages({ 'string.pattern.base': 'Enter an http(s) URL or a site path like /images/logo.png' })

/** Optional link: http(s) URL or a site path. */
export const linkUrl = assetUrl.messages({
  'string.pattern.base': 'Enter an http(s) link or a site path like /contact-us',
})

/** The picture to show for a linked file: its thumbnail when there is one, else the file itself. */
export const mediaSrc = (media?: { url: string; thumbnailUrl: string | null } | null): string =>
  media ? (media.thumbnailUrl ?? media.url) : ''

export function Thumb({ src, alt = '', wide }: { src: string; alt?: string; wide?: boolean }) {
  const size = wide ? 'h-10 w-16' : 'h-10 w-10'
  return src ? (
    <img src={src} alt={alt} className={`${size} shrink-0 rounded-md bg-surface-2 object-contain`} />
  ) : (
    <div className={`${size} flex shrink-0 items-center justify-center rounded-md bg-surface-2 text-xs font-bold text-body`}>
      —
    </div>
  )
}

/** Live preview under an image field. Hides itself if the URL/path can't be loaded. */
export function ImagePreview({ src }: { src: string }) {
  if (!src) return null
  return (
    <img
      src={src}
      alt="Preview"
      className="mt-2 max-h-28 rounded-lg border border-border bg-surface-2 object-contain p-1"
      onError={(e) => (e.currentTarget.style.display = 'none')}
      onLoad={(e) => (e.currentTarget.style.display = 'block')}
    />
  )
}
