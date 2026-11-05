export type Profile = {
  id: string
  name: string
  email: string
  role?: { name: string }
  /** "<subject>:<action>" keys the user is allowed, e.g. "blog:create". */
  permissions: string[]
  /** Avatar image. */
  profile?: { url: string }
}
