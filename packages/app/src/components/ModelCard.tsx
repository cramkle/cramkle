import { plural } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Card, { CardPrimaryContent } from '@material/react-card'
import { Chip } from '@material/react-chips'
import { Headline6 } from '@material/react-typography'
import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

import { ModelsQuery_cardModels } from './__generated__/ModelsQuery'

interface Props {
  className?: string
}

const ModelCard: React.FunctionComponent<
  Props & ModelsQuery_cardModels & RouteComponentProps
> = ({ className = '', id, name, history, fields, templates }) => {
  const { i18n } = useLingui()
  const handleClick = () => history.push(`/m/${id}`)

  return (
    <Card outlined className={className}>
      <CardPrimaryContent
        className="pa2"
        tabIndex={0}
        role="article"
        onClick={handleClick}
        onKeyDown={(e: React.KeyboardEvent) =>
          e.key === 'Enter' && handleClick()
        }
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

export default withRouter(ModelCard)
