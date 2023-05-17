import Link from 'next/link'
import type { VFC } from 'react'

import { GithubLogo } from './GithubLogo'
import { TwitterLogo } from './TwitterLogo'
import { Body2, Overline, Subtitle2 } from './views/Typography'

const links = [
  {
    text: `About`,
    url: '/about',
  },
  {
    text: `Terms and Conditions`,
    url: '/terms',
  },
  {
    text: `Privacy Policy`,
    url: '/privacy',
  },
]

export const Footer: VFC = () => {
  return (
    <footer className="w-full py-8 px-4 sm:px-6 md:px-8 lg:px-32 flex flex-col-reverse md:flex-row bg-surface">
      <div className="flex flex-col mt-4 md:mt-0">
        <Overline className="md:leading-tight text-txt text-opacity-text-primary">
          &copy; {new Date().getFullYear()} Cramkle, Inc.
        </Overline>
        <ul className="list-reset mt-4 flex">
          <li>
            <a
              className="inline-block p-3"
              href="https://github.com/cramkle/cramkle"
              rel="noopener noreferrer"
              target="_blank"
            >
              <GithubLogo
                className="text-txt text-opacity-text-secondary"
                aria-label="GitHub"
              />
            </a>
          </li>
          <li className="ml-4">
            <a
              className="inline-block p-3"
              href="https://twitter.com/lucasecdb"
              rel="noopener noreferrer"
              target="_blank"
            >
              <TwitterLogo
                className="text-txt text-opacity-text-secondary"
                aria-label="Twitter"
              />
            </a>
          </li>
        </ul>
      </div>
      <div className="md:ml-16">
        <Subtitle2 className="leading-tight text-txt text-opacity-text-primary">
          Company
        </Subtitle2>
        <ul className="list-reset mt-4 flex flex-col">
          {links.map((link, i) => (
            <li className="mb-3 md:mb-2 py-2.5 md:py-0" key={i}>
              <Link
                href={link.url}
                className="link text-txt text-opacity-text-secondary inline-block"
              >
                <Body2 className="leading-loose">{link.text}</Body2>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
