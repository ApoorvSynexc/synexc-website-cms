import { KEY_STAT_ICONS, useKeyStat, type KeyStat } from '../../../services'
import { ContentList } from '../ContentList'
import ManageKeyStatModal from './manage'

export default function KeyStatModule() {
  return (
    <ContentList<KeyStat>
      subject="key_stat"
      title="Key Stats"
      description="The headline numbers in the “Why Leaders Choose Synexc?” cards."
      addLabel="Add Key Stat"
      emptyMessage="No key stats added yet."
      useCollection={useKeyStat}
      itemName={(s) => `${s.stat} ${s.title}`}
      Manage={ManageKeyStatModal}
      columns={[
        {
          key: 'stat',
          header: 'Figure',
          width: '90px',
          render: (row) => <span className="text-lg font-bold text-accent">{row.stat}</span>,
        },
        { key: 'title', header: 'Title', render: (row) => <span className="font-medium text-heading">{row.title}</span> },
        {
          key: 'description',
          header: 'Description',
          render: (row) => <span className="line-clamp-2 max-w-sm text-xs">{row.description}</span>,
        },
        {
          key: 'icon',
          header: 'Icon',
          render: (row) => KEY_STAT_ICONS.find((i) => i.value === row.icon)?.label ?? row.icon,
        },
      ]}
    />
  )
}
