import { useEffect, useMemo, useState } from 'react'
import { Button, Dropdown, ModuleHeader, Typography } from '../../../components'
import { useSession } from '../../../hooks'
import { getErrorMessage } from '../../../lib'
import { useRole, useRolePermission } from '../../../services'

const ACTIONS = ['read', 'create', 'update', 'delete']

const SUBJECT_LABEL: Record<string, string> = {
  dashboard: 'Dashboard',
  blog: 'Blogs',
  blog_category: 'Blog Categories',
  case_study: 'Case Studies',
  announcement: 'Announcements',
  hero_slide: 'Hero Slides',
  testimonial: 'Testimonials',
  faq: 'FAQs',
  partner_logo: 'Partner Logos',
  team_member: 'Leadership',
  timeline_event: 'Company Timeline',
  certification: 'Certifications',
  key_stat: 'Key Stats',
  gallery_image: 'Photo Gallery',
  site_settings: 'Site Settings',
  user: 'Users',
  role: 'Roles',
  role_permission: 'Role Permissions',
}

const ACTION_LABEL: Record<string, string> = {
  read: 'View',
  create: 'Create',
  update: 'Edit',
  delete: 'Delete',
}

const checkboxClass = 'h-4 w-4 rounded border-border accent-[var(--accent)] disabled:opacity-50'

export default function RolePermissionModule() {
  const { can } = useSession()
  const canEdit = can('role_permission', 'update')
  const [roleId, setRoleId] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [original, setOriginal] = useState<Set<string>>(new Set())

  const { getRoles } = useRole()
  const { getPermissions, getRolePermissions, updatePermissions } = useRolePermission({
    roleId: roleId || undefined,
  })

  const roles = getRoles.data ?? []
  const permissions = getPermissions.data ?? []
  const selectedRole = roles.find((r) => r.id === roleId)
  const locked = Boolean(selectedRole?.isSystem) || !canEdit

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected(new Set())
    setOriginal(new Set())
  }, [roleId])

  useEffect(() => {
    if (!getRolePermissions.data) return
    const ids = new Set(getRolePermissions.data)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected(ids)
    setOriginal(ids)
  }, [getRolePermissions.data])

  const subjects = useMemo(() => [...new Set(permissions.map((p) => p.subject))], [permissions])
  const exists = (subject: string, action: string) => permissions.some((p) => p.id === `${subject}:${action}`)
  const idsFor = (filter: (subject: string, action: string) => boolean) =>
    permissions.filter((p) => filter(p.subject, p.action)).map((p) => p.id)

  const isDirty =
    selected.size !== original.size || [...selected].some((id) => !original.has(id))

  const setMany = (ids: string[], on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => (on ? next.add(id) : next.delete(id)))
      return next
    })

  const allOn = (ids: string[]) => ids.length > 0 && ids.every((id) => selected.has(id))

  const toggle = (id: string) => setMany([id], !selected.has(id))

  const loading = getPermissions.isLoading || (Boolean(roleId) && getRolePermissions.isLoading)

  return (
    <div className="flex flex-col gap-4">
      <ModuleHeader
        title="Role Permissions"
        description="Choose which modules and actions each role can access."
      />

      <div className="w-full max-w-xs">
        <Dropdown
          label="Role"
          placeholder="Select a role…"
          value={roleId}
          onChange={setRoleId}
          options={roles.map((r) => ({ label: r.name, value: r.id }))}
        />
      </div>

      {!roleId ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <Typography variant="body-sm" color="body">
            Select a role above to view and manage its permissions.
          </Typography>
        </div>
      ) : (
        <>
          {selectedRole?.isSystem && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-600">
              The Admin role has full access by default and cannot be modified.
            </div>
          )}
          {!selectedRole?.isSystem && !canEdit && (
            <div className="rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-body">
              You have view-only access to permissions.
            </div>
          )}
          {updatePermissions.isError && (
            <Typography variant="body-sm" className="text-red-500">
              {getErrorMessage(updatePermissions.error)}
            </Typography>
          )}
          {updatePermissions.isSuccess && !isDirty && (
            <Typography variant="body-sm" className="text-emerald-600">
              Permissions saved.
            </Typography>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Typography variant="body-sm" color="body">
              {selected.size} of {permissions.length} permissions selected
            </Typography>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelected(new Set(original))}
                disabled={!isDirty || updatePermissions.isPending}
              >
                Reset
              </Button>
              <Button
                size="sm"
                loading={updatePermissions.isPending}
                disabled={!isDirty || locked}
                onClick={() =>
                  updatePermissions.mutate({ roleId, permissionIds: Array.from(selected) })
                }
              >
                Save Changes
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  <th className="px-4 py-3 text-left font-medium text-body">
                    <label className="flex w-fit items-center gap-2">
                      <input
                        type="checkbox"
                        className={checkboxClass}
                        disabled={locked || permissions.length === 0}
                        checked={allOn(permissions.map((p) => p.id))}
                        onChange={(e) => setMany(permissions.map((p) => p.id), e.target.checked)}
                      />
                      Module
                    </label>
                  </th>
                  {ACTIONS.map((action) => {
                    const ids = idsFor((_s, a) => a === action)
                    return (
                      <th key={action} className="px-4 py-3 text-center font-medium text-body">
                        <label className="flex flex-col items-center gap-1.5">
                          <span>{ACTION_LABEL[action]}</span>
                          <input
                            type="checkbox"
                            className={checkboxClass}
                            disabled={locked}
                            checked={allOn(ids)}
                            onChange={(e) => setMany(ids, e.target.checked)}
                          />
                        </label>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-border last:border-b-0">
                        <td colSpan={ACTIONS.length + 1} className="px-4 py-3">
                          <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
                        </td>
                      </tr>
                    ))
                  : subjects.map((subject) => (
                      <tr
                        key={subject}
                        className="border-b border-border transition-colors last:border-b-0 hover:bg-surface-2"
                      >
                        <td className="px-4 py-2.5 font-medium text-heading">
                          <label className="flex w-fit items-center gap-2">
                            <input
                              type="checkbox"
                              className={checkboxClass}
                              disabled={locked}
                              checked={allOn(idsFor((s) => s === subject))}
                              onChange={(e) => setMany(idsFor((s) => s === subject), e.target.checked)}
                            />
                            {SUBJECT_LABEL[subject] ?? subject}
                          </label>
                        </td>
                        {ACTIONS.map((action) => (
                          <td key={action} className="px-4 py-2.5 text-center">
                            {exists(subject, action) ? (
                              <input
                                type="checkbox"
                                className={checkboxClass}
                                disabled={locked}
                                checked={selected.has(`${subject}:${action}`)}
                                onChange={() => toggle(`${subject}:${action}`)}
                              />
                            ) : (
                              <span className="text-body/30">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
