import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ReactComponent as GithubLogo } from 'assets/github-logo.svg'
import { ReactComponent as TwitterLogo } from 'assets/twitter-logo.svg'
import React from 'react'
import { Link } from 'react-router-dom'
import * as T from 'views/Typography'

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
    <footer className="w-100 pv4 ph3 ph4-m ph6-ns flex flex-column-reverse flex-row-ns">
      <div className="flex flex-column mt3 mt0-ns">
        <T.Overline className="lh-title-ns">
          &copy; {new Date().getFullYear()} Cramkle, Inc.
        </T.Overline>
        <ul className="list mt3 flex">
          <li>
            <a
              href="https://github.com/cramkle/cramkle"
              rel="noopener noreferrer"
              target="_blank"
            >
              <GithubLogo className="gray" />
            </a>
          </li>
          <li className="ml3">
            <a
              href="https://twitter.com/lucasecdb"
              rel="noopener noreferrer"
              target="_blank"
            >
              <TwitterLogo className="gray" />
            </a>
          </li>
        </ul>
      </div>
      <div className="ml5-ns">
        <T.Subtitle2 className="lh-title">
          <Trans>Company</Trans>
        </T.Subtitle2>
        <ul className="list mt3 flex flex-column">
          {links.map((link, i) => (
            <li className="lh-copy mb2" key={i}>
              <Link to={link.url} className="link gray">
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
