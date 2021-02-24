import { Trans } from '@lingui/macro'
import { useCallback } from 'react'
import * as React from 'react'
import { useNavigate } from 'react-router'

import { BackArrowIcon } from './icons/BackArrowIcon'
import { Button } from './views/Button'

interface Props {
  to: string
}

const BackButton: React.FC<Props> = ({ to }) => {
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    navigate(to)
  }, [to, navigate])

  return (
    <Button className="mb-4 sm:mt-2" onClick={handleClick}>
      <BackArrowIcon className="mr-2" />
      <Trans>Go back</Trans>
    </Button>
  )
}

export default BackButton
