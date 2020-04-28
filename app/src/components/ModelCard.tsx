import { plural } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router'

import { ModelsQuery_cardModels } from './__generated__/ModelsQuery'
import Card, { CardPrimaryContent } from './views/Card'
import { Chip } from './views/Chip'
import { Headline6 } from './views/Typography'

interface Props {
  className?: string
}

const ModelCard: React.FunctionComponent<Props & ModelsQuery_cardModels> = ({
  className = '',
  id,
  name,
  fields,
  templates,
}) => {
  const history = useHistory()
  const { i18n } = useLingui()
  const handleClick = useCallback(() => history.push(`/m/${id}`), [history, id])
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => e.key === 'Enter' && handleClick(),
    [handleClick]
  )

  return (
    <Card outlined className={className}>
      <CardPrimaryContent
        className="p-2"
        tabIndex={0}
        role="article"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <Headline6>{name}</Headline6>
        {!!(templates.length || fields.length) && (
          <div className="flex">
            {!!templates.length && (
              <Chip>
                {i18n._(
                  plural(templates.length, {
                    one: '# template',
                    other: '# templates',
                  })
                )}
              </Chip>
            )}
            {!!fields.length && (
              <Chip className="ml-2">
                {i18n._(
                  plural(fields.length, {
                    one: '# field',
                    other: '# fields',
                  })
                )}
              </Chip>
            )}
          </div>
        )}
      </CardPrimaryContent>
    </Card>
  )
}

export default ModelCard
