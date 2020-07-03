import { plural } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router'

import { ModelsQuery_models } from './__generated__/ModelsQuery'
import { Card, CardPressable } from './views/Card'
import { Chip } from './views/Chip'
import { Headline3 } from './views/Typography'

interface Props {
  className?: string
}

const ModelCard: React.FunctionComponent<Props & ModelsQuery_models> = ({
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

  const uniqueId = `model-${id}`

  return (
    <Card className={className}>
      <CardPressable
        className="p-2"
        role="article"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-describedby={`${uniqueId}-title`}
      >
        <Headline3 id={`${uniqueId}-title`}>{name}</Headline3>
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
      </CardPressable>
    </Card>
  )
}

export default ModelCard
