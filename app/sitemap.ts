export const baseUrl = 'https://segov.dev'

export default async function sitemap() {
  const routes = ['', '/career', '/projects'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes]
}
