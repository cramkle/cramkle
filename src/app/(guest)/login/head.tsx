'use client'

import { t } from '@lingui/macro'

export default function Head() {
  return (
    <>
      <title>{t`Login`}</title>
      <meta
        name="description"
        content={t`Login to your account to study your decks`}
      />
    </>
  )
}
