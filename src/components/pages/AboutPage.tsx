import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import * as React from 'react'
import { Helmet } from 'react-helmet'

const AboutPage: React.FunctionComponent = () => {
  const { i18n } = useLingui()

  return (
    <div>
      <Helmet>
        <title>{i18n._(t`About`)}</title>
        <meta
          name="description"
          content={i18n._(t`About our mission and values, read more`)}
        />
      </Helmet>
      This page is still under development
    </div>
  )
}

export default AboutPage
