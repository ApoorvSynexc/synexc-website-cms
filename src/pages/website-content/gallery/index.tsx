import { useGallery, type GalleryImage, type GalleryImageInput } from '../../../services'
import { ContentList } from '../ContentList'
import { mediaSrc, Thumb } from '../shared'
import ManageGalleryModal from './manage'

export default function GalleryModule() {
  return (
    <ContentList<GalleryImage, GalleryImageInput>
      subject="gallery_image"
      title="Photo Gallery"
      description="Photos from “Life at Synexc” and event albums on the About page."
      addLabel="Add Photo"
      emptyMessage="No photos added yet."
      useCollection={useGallery}
      itemName={(g) => g.caption || g.image.name}
      Manage={ManageGalleryModal}
      columns={[
        {
          key: 'image',
          header: 'Photo',
          render: (row) => (
            <div className="flex items-center gap-3">
              <Thumb src={mediaSrc(row.image)} wide />
              <div className="min-w-0">
                <div className="truncate text-heading">{row.caption || '—'}</div>
                <div className="max-w-xs truncate text-xs text-body">{row.image.name}</div>
              </div>
            </div>
          ),
        },
        {
          key: 'album',
          header: 'Album',
          render: (row) => (
            <span className="rounded-full bg-accent-bg px-2.5 py-0.5 text-xs font-medium text-accent">
              {row.album}
            </span>
          ),
        },
      ]}
    />
  )
}
