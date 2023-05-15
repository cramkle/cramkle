import { Trans } from '@lingui/macro'
import Link from 'next/link'
import * as React from 'react'

import { BackArrowIcon } from './icons/BackArrowIcon'
import { Button } from './views/Button'

interface Props {
  to: string
}

const BackButton: React.FC<Props> = ({ to }) => {
  return (
    <Button className="mb-4 sm:mt-2" as={Link} href={to}>
      <BackArrowIcon className="mr-2" />
      <Trans>Go back</Trans>
    </Button>
  )
}

export default BackButton
