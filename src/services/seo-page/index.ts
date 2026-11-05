import { createContentCollection } from '../website-content/collection'

export type SeoPage = {
  id: string
  /** Website path, e.g. "/about-us". */
  path: string
  /** Friendly name for the CMS list only. */
  pageName: string
  /** <title> tag — keep under ~60 characters. */
  title: string
  /** Meta description — keep under ~160 characters. */
  description: string
  /** Social share image: http(s) URL or a site path. */
  ogImage: string
  noIndex: boolean
  /** Unused for SEO (always true); required by the shared list helper. */
  isActive: boolean
}

const page = (id: string, path: string, pageName: string, title = '', description = ''): SeoPage => ({
  id,
  path,
  pageName,
  title,
  description,
  ogImage: '',
  noIndex: false,
  isActive: true,
})

// Pages the website serves. Only the Blog page has metadata defined in code today;
// the rest are blank so the team can fill them in.
export const useSeoPage = createContentCollection<SeoPage>('seo-pages', [
  page('seo1', '/', 'Home'),
  page('seo2', '/about-us', 'About us'),
  page('seo3', '/culture', 'Culture'),
  page('seo4', '/industries', 'Industries'),
  page('seo5', '/case-studies', 'Case studies'),
  page(
    'seo6',
    '/blog',
    'Blog',
    'Blog | Synexc Solutions',
    'Stay updated with the latest insights on AI, Salesforce, Zoho, and digital transformation.',
  ),
  page('seo7', '/contact-us', 'Contact us'),
])
