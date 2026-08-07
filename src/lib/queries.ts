import { groq } from 'next-sanity'

export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    "categoryTitle": category->title,
    "categorySlug": category->slug.current,
    publishedAt
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    body,
    "categoryTitle": category->title,
    "categorySlug": category->slug.current,
    publishedAt,
    seo
  }
`

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id, title, "slug": slug.current, audience, summary, cardSummary
  }
`

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, audience, summary, cardSummary, headerImage, image, highlights, body, tabSections, closingText, seo
  }
`

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, intro, body, seo
  }
`

export const allPageSlugsQuery = groq`
  *[_type == "page"] { "slug": slug.current }
`

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc) {
    _id, name, roleAndCompany, photo, quote
  }
`

export const clientLogosQuery = groq`
  *[_type == "clientLogo"] | order(order asc) {
    _id, name, logo, website
  }
`

export const galleryQuery = groq`
  *[_type == "galleryItem"] | order(order asc) {
    _id, image, "alt": image.alt, "caption": image.caption, eventDate
  }
`

export const interviewsQuery = groq`
  *[_type == "interview"] | order(publishedAt desc) {
    _id, title, "slug": slug.current, outlet, publishedAt, coverImage
  }
`

export const interviewBySlugQuery = groq`
  *[_type == "interview" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, outlet, publishedAt, coverImage, audioTracks, videoUrl, body, seo
  }
`

export const usefulLinksQuery = groq`
  *[_type == "usefulLink"] | order(order asc) {
    _id, label, url, description
  }
`

export const careerTipsQuery = groq`
  *[_type == "careerTip"] | order(order asc) {
    _id, title, instagramUrl
  }
`

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`

export const navigationQuery = groq`*[_type == "navigation"][0].items`

export const homePageQuery = groq`*[_type == "homePage"][0]`
