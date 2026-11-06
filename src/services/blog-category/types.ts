export type BlogCategory = {
  id: string
  name: string
  slug: string
}

export type BlogCategoryInput = Omit<BlogCategory, 'id' | 'slug'>
