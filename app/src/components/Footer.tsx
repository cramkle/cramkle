import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React from 'react'
import { Link } from 'react-router-dom'

import { ReactComponent as GithubLogo } from '../assets/github-logo.svg'
import { ReactComponent as TwitterLogo } from '../assets/twitter-logo.svg'
import * as T from './views/Typography'

const links = [
  {
    text: t`About`,
    url: '/about',
  },
  {
    text: t`Terms and Conditions`,
    url: '/terms',
  },
  {
    text: t`Privacy Policy`,
    url: '/privacy',
  },
]

const Footer: React.FC = () => {
  const { i18n } = useLingui()

  return (
    <footer className="w-full py-8 px-4 lg:px-8 xl:px-32 flex flex-col-reverse sm:flex-row">
      <div className="flex flex-col mt-4 sm:mt-0">
        <T.Overline className="sm:leading-tight">
          &copy; {new Date().getFullYear()} Cramkle, Inc.
        </T.Overline>
        <ul className="list-reset mt-4 flex">
          <li>
            <a
              href="https://github.com/cramkle/cramkle"
              rel="noopener noreferrer"
              target="_blank"
            >
              <GithubLogo className="text-secondary" />
            </a>
          </li>
          <li className="ml-4">
            <a
              href="https://twitter.com/lucasecdb"
              rel="noopener noreferrer"
              target="_blank"
            >
              <TwitterLogo className="text-secondary" />
            </a>
          </li>
        </ul>
      </div>
      <div className="sm:ml-16">
        <T.Subtitle2 className="leading-tight">
          <Trans>Company</Trans>
        </T.Subtitle2>
        <ul className="list-reset mt-4 flex flex-col">
          {links.map((link, i) => (
            <li className="leading-normal mb-2" key={i}>
              <Link to={link.url} className="link text-secondary">
                <T.Body2>{i18n._(link.text)}</T.Body2>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}

export default Footer
