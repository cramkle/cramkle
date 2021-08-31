import { Trans } from '@lingui/macro'
import * as React from 'react'
import { Link } from 'react-router-dom'

import { BackArrowIcon } from './icons/BackArrowIcon'
import { Button } from './views/Button'

interface Props {
  to: string
}

const BackButton: React.FC<Props> = ({ to }) => {
  return (
    <Button className="mb-4 sm:mt-2" as={Link} to={to}>
      <BackArrowIcon className="mr-2" />
      <Trans>Go back</Trans>
    </Button>
  )
}

export default BackButton
