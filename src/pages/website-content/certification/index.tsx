import { CERTIFICATION_ICONS, useCertification, type Certification } from '../../../services'
import { ContentList } from '../ContentList'
import ManageCertificationModal from './manage'

export default function CertificationModule() {
  return (
    <ContentList<Certification>
      subject="certification"
      title="Certifications & Recognitions"
      description="Partner badges and standards shown in the Recognitions section of the About page."
      addLabel="Add Certification"
      emptyMessage="No certifications added yet."
      useCollection={useCertification}
      itemName={(c) => c.title}
      Manage={ManageCertificationModal}
      columns={[
        {
          key: 'title',
          header: 'Certification',
          render: (row) => (
            <div className="min-w-0">
              <div className="font-medium text-heading">{row.title}</div>
              <div className="text-xs text-body">{row.type}</div>
            </div>
          ),
        },
        {
          key: 'description',
          header: 'Description',
          render: (row) => <span className="line-clamp-2 max-w-sm text-xs">{row.description}</span>,
        },
        {
          key: 'icon',
          header: 'Icon',
          render: (row) => CERTIFICATION_ICONS.find((i) => i.value === row.icon)?.label ?? row.icon,
        },
      ]}
    />
  )
}
