import { plural } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Chip } from '@material/react-chips'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router'
import Card, { CardPrimaryContent } from 'views/Card'
import { Headline6 } from 'views/Typography'

import { ModelsQuery_cardModels } from './__generated__/ModelsQuery'

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
        className="pa2"
        tabIndex={0}
        role="article"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <Headline6>{name}</Headline6>
        {!!(templates.length || fields.length) && (
          <div className="mdc-chip-set">
            {!!templates.length && (
              <Chip
                label={i18n._(
                  plural(templates.length, {
                    one: '# template',
                    other: '# templates',
                  })
                )}
              />
            )}
            {!!fields.length && (
              <Chip
                label={i18n._(
                  plural(fields.length, {
                    one: '# field',
                    other: '# fields',
                  })
                )}
              />
            )}
          </div>
        )}
      </CardPrimaryContent>
    </Card>
  )
}

export default ModelCard
