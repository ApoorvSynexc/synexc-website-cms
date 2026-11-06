import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/auth/login'
import BlogsPage from '../pages/blogs'
import DashboardPage from '../pages/dashboard'
import CaseStudiesPage from '../pages/case-studies'
import AnnouncementsPage from '../pages/announcements'
import WebsiteContentPage from '../pages/website-content'
import SiteSettingsPage from '../pages/site-settings'
import AccessControlPage from '../pages/access-control'
import { useSession } from '../hooks'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { PermissionRoute } from './PermissionRoute'
import { AppLayout } from '../layout/AppLayout'

const WEBSITE_CONTENT_SUBJECTS = [
  'hero_slide',
  'testimonial',
  'faq',
  'partner_logo',
  'team_member',
  'timeline_event',
  'certification',
  'key_stat',
  'gallery_image',
]

/** Send the user to the first page their role can actually open. */
function HomeRedirect() {
  const { can, isAuthenticated } = useSession()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (can('dashboard', 'read')) return <Navigate to="/dashboard" replace />
  if (can('blog', 'read')) return <Navigate to="/blogs" replace />
  if (can('case_study', 'read')) return <Navigate to="/case-studies" replace />
  if (can('announcement', 'read')) return <Navigate to="/announcements" replace />
  if (can('site_settings', 'read')) return <Navigate to="/site-settings" replace />
  if (WEBSITE_CONTENT_SUBJECTS.some((s) => can(s, 'read'))) return <Navigate to="/website-content" replace />
  if (can('user', 'read') || can('role', 'read') || can('role_permission', 'read')) {
    return <Navigate to="/access-control" replace />
  }
  return <Navigate to="/dashboard" replace /> // shows the "No access" screen
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route
          path="/dashboard"
          element={<PermissionRoute anyOf={[['dashboard', 'read']]}><DashboardPage /></PermissionRoute>}
        />
        <Route
          path="/blogs"
          element={<PermissionRoute anyOf={[['blog', 'read']]}><BlogsPage /></PermissionRoute>}
        />
        <Route
          path="/case-studies"
          element={<PermissionRoute anyOf={[['case_study', 'read']]}><CaseStudiesPage /></PermissionRoute>}
        />
        <Route
          path="/announcements"
          element={<PermissionRoute anyOf={[['announcement', 'read']]}><AnnouncementsPage /></PermissionRoute>}
        />
        <Route
          path="/site-settings"
          element={
            <PermissionRoute anyOf={[['site_settings', 'read']]}>
              <SiteSettingsPage />
            </PermissionRoute>
          }
        />
        <Route path="/website-content" element={<Navigate to="/website-content/hero-slide" replace />} />
        <Route
          path="/website-content/:module"
          element={
            <PermissionRoute anyOf={WEBSITE_CONTENT_SUBJECTS.map((s): [string, string] => [s, 'read'])}>
              <WebsiteContentPage />
            </PermissionRoute>
          }
        />
        <Route path="/access-control" element={<Navigate to="/access-control/user" replace />} />
        <Route
          path="/access-control/:module"
          element={
            <PermissionRoute anyOf={[['user', 'read'], ['role', 'read'], ['role_permission', 'read']]}>
              <AccessControlPage />
            </PermissionRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
