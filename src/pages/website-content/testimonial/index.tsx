import { TESTIMONIAL_PAGES, useTestimonial, type Testimonial } from '../../../services'
import { ContentList } from '../ContentList'
import { Thumb } from '../shared'
import ManageTestimonialModal from './manage'

const pageLabel = (value: string) => TESTIMONIAL_PAGES.find((p) => p.value === value)?.label ?? value

export default function TestimonialModule() {
  return (
    <ContentList<Testimonial>
      subject="testimonial"
      title="Testimonials"
      description="Client quotes shown on the home, about, culture, case study and industry pages."
      addLabel="Add Testimonial"
      emptyMessage="No testimonials added yet."
      useCollection={useTestimonial}
      itemName={(t) => t.name}
      Manage={ManageTestimonialModal}
      columns={[
        {
          key: 'name',
          header: 'Client',
          render: (row) => (
            <div className="flex items-center gap-3">
              <Thumb src={row.avatar} />
              <div className="min-w-0">
                <div className="truncate font-medium text-heading">{row.name}</div>
                <div className="truncate text-xs text-body">{row.role}</div>
              </div>
            </div>
          ),
        },
        {
          key: 'message',
          header: 'Quote',
          render: (row) => <span className="line-clamp-2 max-w-xs text-xs">{row.message}</span>,
        },
        {
          key: 'pages',
          header: 'Pages',
          render: (row) => (
            <div className="flex max-w-40 flex-wrap gap-1">
              {row.pages.map((p) => (
                <span key={p} className="rounded bg-surface-2 px-1.5 py-0.5 text-[11px] text-body">
                  {pageLabel(p)}
                </span>
              ))}
            </div>
          ),
        },
      ]}
    />
  )
}
