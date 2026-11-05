import { useSeoPage, type SeoPage } from '../../../services'
import { ContentList } from '../../website-content/ContentList'
import ManageSeoModal from './manage'

const Missing = () => (
  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600">Not set</span>
)

export default function SeoModule() {
  return (
    <ContentList<SeoPage>
      subject="seo_page"
      title="Page SEO"
      description="The title and description search engines show for each page."
      addLabel="Add Page"
      emptyMessage="No pages added yet."
      useCollection={useSeoPage}
      reorderable={false}
      toggleable={false}
      itemName={(p) => p.pageName}
      Manage={ManageSeoModal}
      columns={[
        {
          key: 'page',
          header: 'Page',
          render: (row) => (
            <div className="min-w-0">
              <div className="font-medium text-heading">{row.pageName}</div>
              <div className="text-xs text-body">{row.path}</div>
            </div>
          ),
        },
        {
          key: 'title',
          header: 'SEO title',
          render: (row) => (row.title ? <span className="line-clamp-1 max-w-xs">{row.title}</span> : <Missing />),
        },
        {
          key: 'description',
          header: 'Description',
          render: (row) =>
            row.description ? <span className="line-clamp-1 max-w-sm text-xs">{row.description}</span> : <Missing />,
        },
        {
          key: 'noIndex',
          header: 'Indexing',
          render: (row) =>
            row.noIndex ? (
              <span className="rounded-full bg-slate-500/10 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                Hidden
              </span>
            ) : (
              'Allowed'
            ),
        },
      ]}
    />
  )
}
