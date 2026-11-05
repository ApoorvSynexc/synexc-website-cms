/**
 * Mock data for access control (users, roles, permissions), shared by the
 * account / auth / user / role / role-permission services while the UI is
 * built before the API. Persisted to localStorage so a user created here can
 * still log in after a page refresh. Delete this file when the API is live.
 */
import type { Permission } from './role-permission/types'
import type { Role } from './role/types'
import type { User } from './user/types'

const CRUD = ['read', 'create', 'update', 'delete']

/** Every module and the actions that exist for it (the permission matrix rows/columns). */
export const SUBJECT_ACTIONS: Record<string, string[]> = {
  dashboard: ['read'],
  blog: CRUD,
  blog_category: CRUD,
  case_study: CRUD,
  announcement: CRUD,
  hero_slide: CRUD,
  testimonial: CRUD,
  faq: CRUD,
  partner_logo: CRUD,
  team_member: CRUD,
  timeline_event: CRUD,
  certification: CRUD,
  key_stat: CRUD,
  gallery_image: CRUD,
  site_settings: ['read', 'update'],
  inquiry: ['read', 'update', 'delete'],
  user: CRUD,
  role: CRUD,
  role_permission: ['read', 'update'],
}

export const PERMISSIONS: Permission[] = Object.entries(SUBJECT_ACTIONS).flatMap(
  ([subject, actions]) => actions.map((action) => ({ id: `${subject}:${action}`, subject, action })),
)

export const ALL_PERMISSION_IDS = PERMISSIONS.map((p) => p.id)

export const ADMIN_ROLE_ID = 'r-admin'
export const MOCK_PASSWORD = 'password123'

type State = { roles: Role[]; users: (User & { password: string })[] }

const seed = (): State => ({
  roles: [
    {
      id: ADMIN_ROLE_ID,
      name: 'Admin',
      description: 'Full access to everything.',
      isSystem: true,
      permissionIds: [],
    },
    {
      id: 'r-editor',
      name: 'Editor',
      description: 'Manages blogs and categories.',
      isSystem: false,
      permissionIds: [
        'dashboard:read',
        ...['read', 'create', 'update', 'delete'].map((a) => `blog:${a}`),
        ...['read', 'create', 'update', 'delete'].map((a) => `blog_category:${a}`),
        ...['read', 'create', 'update', 'delete'].map((a) => `case_study:${a}`),
        ...['read', 'create', 'update', 'delete'].map((a) => `announcement:${a}`),
        ...['hero_slide', 'testimonial', 'faq', 'partner_logo', 'team_member', 'timeline_event', 'certification', 'key_stat', 'gallery_image'].flatMap((s) =>
          ['read', 'create', 'update', 'delete'].map((a) => `${s}:${a}`),
        ),
      ],
    },
    {
      id: 'r-writer',
      name: 'Writer',
      description: 'Writes and edits blogs, cannot delete.',
      isSystem: false,
      permissionIds: [
        'dashboard:read',
        'blog:read',
        'blog:create',
        'blog:update',
        'blog_category:read',
      ],
    },
  ],
  users: [
    ['u-admin', 'Synexc Admin', 'admin@synexc.com', ADMIN_ROLE_ID, 'ACTIVE', 200],
    ['u-priya', 'Priya Nair', 'priya@synexc.com', 'r-editor', 'ACTIVE', 120],
    ['u-alex', 'Alex Rivera', 'alex@synexc.com', 'r-writer', 'ACTIVE', 60],
    ['u-sarah', 'Sarah Chen', 'sarah@synexc.com', 'r-writer', 'ACTIVE', 30],
    ['u-rahul', 'Rahul Mehta', 'rahul@synexc.com', 'r-writer', 'INACTIVE', 10],
  ].map(([id, name, email, roleId, status, daysAgo]) => ({
    id: id as string,
    name: name as string,
    email: email as string,
    roleId: roleId as string,
    status: status as User['status'],
    createdAt: new Date(Date.now() - (daysAgo as number) * 86_400_000).toISOString(),
    password: MOCK_PASSWORD,
  })),
})

const KEY = 'synexc-access-store-v2'

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as State
  } catch {
    /* fall through to seed */
  }
  return seed()
}

export const access: State = load()

export const persist = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(access))
  } catch {
    /* storage unavailable — data just won't survive a refresh */
  }
}

/** Ignores permission ids saved before a module was removed, so counts and checks stay accurate. */
export const permissionIdsOf = (role: Role) =>
  role.isSystem ? ALL_PERMISSION_IDS : role.permissionIds.filter((id) => ALL_PERMISSION_IDS.includes(id))
