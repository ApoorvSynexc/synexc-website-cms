import { useTimeline, type TimelineEvent } from '../../../services'
import { ContentList } from '../ContentList'
import ManageTimelineModal from './manage'

export default function TimelineModule() {
  return (
    <ContentList<TimelineEvent>
      subject="timeline_event"
      title="Company Timeline"
      description="Milestones shown in the “Our Journey” timeline on the About page."
      addLabel="Add Milestone"
      emptyMessage="No milestones added yet."
      useCollection={useTimeline}
      itemName={(e) => `${e.year} ${e.title}`}
      Manage={ManageTimelineModal}
      columns={[
        {
          key: 'year',
          header: 'Year',
          width: '80px',
          render: (row) => <span className="font-semibold text-accent">{row.year}</span>,
        },
        { key: 'title', header: 'Milestone', render: (row) => <span className="font-medium text-heading">{row.title}</span> },
        {
          key: 'description',
          header: 'Description',
          render: (row) => <span className="line-clamp-2 max-w-md text-xs">{row.description}</span>,
        },
      ]}
    />
  )
}
