import { FiCheck, FiMonitor, FiMoon, FiSun } from 'react-icons/fi'
import { PALETTES, useTheme, type Palette, type ThemeMode } from './ThemeProvider'

const PALETTE_SWATCHES: Record<Palette, { label: string; color: string }> = {
  indigo: { label: 'Indigo', color: '#4f46e5' },
  blue: { label: 'Blue', color: '#2563eb' },
  teal: { label: 'Teal', color: '#0f766e' },
  emerald: { label: 'Emerald', color: '#047857' },
  violet: { label: 'Violet', color: '#7c3aed' },
  rose: { label: 'Rose', color: '#e11d48' },
  amber: { label: 'Amber', color: '#b45309' },
  olive: { label: 'Olive', color: '#867e32' },
}

const MODES: { value: ThemeMode; label: string; icon: typeof FiSun }[] = [
  { value: 'light', label: 'Light', icon: FiSun },
  { value: 'dark', label: 'Dark', icon: FiMoon },
  { value: 'system', label: 'System', icon: FiMonitor },
]

/** Light / dark / system switch plus the accent colour grid. Lives inside the profile menu. */
export function AppearanceSettings() {
  const { mode, setMode, palette, setPalette } = useTheme()
  return (
    <div className="space-y-3 px-4 py-3">
      <p className="text-xs font-semibold tracking-wide text-body uppercase">Appearance</p>

      <div role="radiogroup" aria-label="Theme mode" className="grid grid-cols-3 gap-1 rounded-lg bg-surface-2 p-1">
        {MODES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={mode === value}
            onClick={() => setMode(value)}
            className={`flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
              mode === value ? 'bg-surface text-heading shadow-sm' : 'text-body hover:text-heading'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      <div role="radiogroup" aria-label="Accent colour" className="grid grid-cols-4 gap-2">
        {PALETTES.map((p) => {
          const meta = PALETTE_SWATCHES[p]
          const active = palette === p
          return (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setPalette(p)}
              className={`flex flex-col items-center gap-1 rounded-lg border p-1.5 transition-colors ${
                active ? 'border-accent bg-accent-bg' : 'border-transparent hover:bg-surface-2'
              }`}
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                style={{ background: meta.color }}
              >
                {active && <FiCheck size={13} />}
              </span>
              <span className="text-[11px] text-body">{meta.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Compact row of colour dots, for places without a profile menu (the login screen). */
export function PalettePicker() {
  const { palette, setPalette } = useTheme()
  return (
    <div
      role="radiogroup"
      aria-label="Accent colour"
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-2 py-1.5"
    >
      {PALETTES.map((p) => {
        const meta = PALETTE_SWATCHES[p]
        const active = palette === p
        return (
          <button
            key={p}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={meta.label}
            title={meta.label}
            onClick={() => setPalette(p)}
            className={`h-5 w-5 rounded-full border-2 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              active ? 'border-heading' : 'border-transparent'
            }`}
            style={{ background: meta.color }}
          />
        )
      })}
    </div>
  )
}
