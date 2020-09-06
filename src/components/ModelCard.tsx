import { plural } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router'

import { ModelsQuery_models } from './pages/__generated__/ModelsQuery'
import { Card, CardContent, CardPressable } from './views/Card'
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
        role="article"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-describedby={`${uniqueId}-title`}
      >
        <CardContent>
          <Headline3 id={`${uniqueId}-title`}>{name}</Headline3>
          {!!(templates.length || fields.length) && (
            <div className="flex mt-4">
              {!!templates.length && (
                <Chip className="mr-4">
                  {i18n._(
                    plural(templates.length, {
                      one: '# template',
                      other: '# templates',
                    })
                  )}
                </Chip>
              )}
              {!!fields.length && (
                <Chip>
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
        </CardContent>
      </CardPressable>
    </Card>
  )
}

export default ModelCard
