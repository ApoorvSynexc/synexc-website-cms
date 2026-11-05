import { usePartnerLogo, type PartnerLogo } from '../../../services'
import { ContentList } from '../ContentList'
import { Thumb } from '../shared'
import ManagePartnerLogoModal from './manage'

export default function PartnerLogoModule() {
  return (
    <ContentList<PartnerLogo>
      subject="partner_logo"
      title="Partner & Client Logos"
      description="Logos shown in the “Our Trusted Partners” strip and client sections."
      addLabel="Add Logo"
      emptyMessage="No logos added yet."
      useCollection={usePartnerLogo}
      itemName={(l) => l.name}
      Manage={ManagePartnerLogoModal}
      columns={[
        {
          key: 'name',
          header: 'Logo',
          render: (row) => (
            <div className="flex items-center gap-3">
              <Thumb src={row.logo} wide />
              <span className="font-medium text-heading">{row.name}</span>
            </div>
          ),
        },
        {
          key: 'placement',
          header: 'Shown in',
          render: (row) => (row.placement === 'PARTNER' ? 'Trusted partners' : 'Client logos'),
        },
        { key: 'link', header: 'Link', render: (row) => row.link || '—' },
      ]}
    />
  )
}
