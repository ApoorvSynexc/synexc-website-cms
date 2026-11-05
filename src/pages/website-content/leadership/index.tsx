import { Avatar } from '../../../components'
import { useLeadership, type TeamMember } from '../../../services'
import { ContentList } from '../ContentList'
import ManageLeadershipModal from './manage'

export default function LeadershipModule() {
  return (
    <ContentList<TeamMember>
      subject="team_member"
      title="Leadership"
      description="People shown in the “Our Leadership” section of the About page."
      addLabel="Add Team Member"
      emptyMessage="No team members added yet."
      useCollection={useLeadership}
      itemName={(m) => m.name}
      Manage={ManageLeadershipModal}
      columns={[
        {
          key: 'name',
          header: 'Person',
          render: (row) => (
            <div className="flex items-center gap-3">
              <Avatar name={row.name} src={row.photo || undefined} size="sm" />
              <div className="min-w-0">
                <div className="truncate font-medium text-heading">{row.name}</div>
                <div className="truncate text-xs text-body">{row.role}</div>
              </div>
            </div>
          ),
        },
        {
          key: 'bio',
          header: 'Bio',
          render: (row) => <span className="line-clamp-2 max-w-sm text-xs">{row.bio}</span>,
        },
        {
          key: 'contact',
          header: 'Contact',
          render: (row) => (
            <div className="max-w-44 truncate text-xs">
              {row.email || '—'}
              {row.linkedin && <div className="text-accent">LinkedIn</div>}
            </div>
          ),
        },
      ]}
    />
  )
}
