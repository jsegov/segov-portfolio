export const robots = {
  rules: [
    {
      userAgent: '*',
    },
  ],
  sitemap: `${process.env.NEXT_PUBLIC_URL || 'https://segov.app'}/sitemap.xml`,
}
