import { useState } from 'react'
import { Tabs, Typography } from '../../components'
import { useSession } from '../../hooks'
import CategoriesModule from './categories'
import PostsModule from './posts'

export default function BlogsPage() {
  const { can } = useSession()
  const [tab, setTab] = useState('posts')
  const showCategories = can('blog_category', 'read')

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="shrink-0">
        <Typography variant="h5">Blog Management</Typography>
        <Typography variant="body-sm" color="body" className="mt-0.5">
          Manage the articles and categories shown on the Synexc website.
        </Typography>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-border bg-surface p-5">
        <Tabs
          className="mb-6"
          active={tab}
          onChange={setTab}
          items={[
            { key: 'posts', label: 'Blogs' },
            ...(showCategories ? [{ key: 'categories', label: 'Categories' }] : []),
          ]}
        />
        {tab === 'categories' && showCategories ? <CategoriesModule /> : <PostsModule />}
      </div>
    </div>
  )
}
