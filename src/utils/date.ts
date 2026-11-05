import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const formatDate = (value: string | Date, format = 'DD MMM YYYY') =>
  dayjs(value).format(format)

export const formatDateTime = (value: string | Date) => dayjs(value).format('DD MMM YYYY, hh:mm A')

/** "5 minutes ago", "2 days ago" */
export const fromNow = (value: string | Date) => dayjs(value).fromNow()
