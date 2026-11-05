import { useFaq, type Faq } from '../../../services'
import { ContentList } from '../ContentList'
import ManageFaqModal from './manage'

export default function FaqModule() {
  return (
    <ContentList<Faq>
      subject="faq"
      title="FAQs"
      description="Questions and answers shown in the FAQ sections across the website."
      addLabel="Add FAQ"
      emptyMessage="No FAQs added yet."
      useCollection={useFaq}
      itemName={(f) => f.question}
      Manage={ManageFaqModal}
      columns={[
        {
          key: 'question',
          header: 'Question',
          render: (row) => (
            <div className="min-w-0">
              <div className="max-w-md font-medium text-heading">{row.question}</div>
              <div className="line-clamp-1 max-w-md text-xs text-body">{row.answer}</div>
            </div>
          ),
        },
        {
          key: 'group',
          header: 'Shown on',
          render: (row) => (
            <span className="rounded-full bg-accent-bg px-2.5 py-0.5 text-xs font-medium text-accent">
              {row.group}
            </span>
          ),
        },
      ]}
    />
  )
}
