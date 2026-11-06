import { useHeroSlide, type HeroSlide, type HeroSlideInput } from '../../../services'
import { ContentList } from '../ContentList'
import { mediaSrc, Thumb } from '../shared'
import ManageHeroSlideModal from './manage'

export default function HeroSlideModule() {
  return (
    <ContentList<HeroSlide, HeroSlideInput>
      subject="hero_slide"
      title="Hero Slides"
      description="The rotating banner at the top of the home page."
      addLabel="Add Hero Slide"
      emptyMessage="No hero slides added yet."
      useCollection={useHeroSlide}
      itemName={(s) => s.title}
      Manage={ManageHeroSlideModal}
      columns={[
        {
          key: 'title',
          header: 'Slide',
          render: (row) => (
            <div className="flex items-center gap-3">
              <Thumb src={mediaSrc(row.image)} wide />
              <div className="min-w-0">
                <div className="max-w-xs truncate font-medium text-heading">{row.title}</div>
                <div className="max-w-xs truncate text-xs text-body">{row.category}</div>
              </div>
            </div>
          ),
        },
        {
          key: 'description',
          header: 'Description',
          render: (row) => <span className="line-clamp-2 max-w-xs text-xs">{row.description}</span>,
        },
        { key: 'link', header: 'Link', render: (row) => row.link || '—' },
      ]}
    />
  )
}
