const escapeCell = (value: unknown) => {
  const text = String(value ?? '')
  // Quote anything with a comma, quote or newline; double up inner quotes.
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** Build a CSV (with a BOM so Excel reads UTF-8) and trigger a browser download. */
export function downloadCsv(filename: string, headers: string[], rows: unknown[][]) {
  const csv = [headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n')
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
