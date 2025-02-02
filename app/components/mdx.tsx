import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'

const slugify = (str: string) => str
  .toLowerCase()
  .trim()
  .replace(/\s+/g, '-')
  .replace(/&/g, '-and-')
  .replace(/[^\w\-]+/g, '')
  .replace(/\-\-+/g, '-')

const createHeading = (level: number) => {
  const Heading = ({ children }: { children: React.ReactNode }) => {
    const slug = slugify(children?.toString() || '')
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }
  return Heading
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: (props: any) => <Image alt={props.alt} className="rounded-lg" {...props} />,
  a: (props: any) => {
    const href = props.href
    if (href.startsWith('/')) {
      return <Link href={href} {...props}>{props.children}</Link>
    }
    if (href.startsWith('#')) {
      return <a {...props} />
    }
    return <a target="_blank" rel="noopener noreferrer" {...props} />
  },
  code: ({ children, ...props }: { children: string }) => (
    <code dangerouslySetInnerHTML={{ __html: highlight(children) }} {...props} />
  ),
  Table: ({ data }: { data: { headers: string[], rows: string[][] }}) => (
    <table>
      <thead>
        <tr>
          {data.headers.map((header, i) => <th key={i}>{header}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => <td key={j}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}

export function CustomMDX(props: any) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  )
}
