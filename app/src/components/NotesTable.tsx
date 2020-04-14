import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { RawDraftContentState, convertFromRaw } from 'draft-js'
import React from 'react'

import Card from 'views/Card'
import { Body2 } from 'views/Typography'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuLink,
  MenuList,
} from 'views/MenuButton'
import { DeckQuery_deck_notes } from 'pages/__generated__/DeckQuery'
import Icon from './views/Icon'

interface Props {
  notes: DeckQuery_deck_notes[]
  deckSlug: string
}

const NotesTable: React.FC<Props> = ({ notes, deckSlug }) => {
  const { i18n } = useLingui()

  if (!notes.length) {
    return (
      <Card className="w-100 mt2 pv3 ph2 flex flex-row justify-center" outlined>
        <Body2>
          <Trans>You haven't created any notes on this deck yet</Trans>
        </Body2>
      </Card>
    )
  }

  return (
    <div className="ba br2 b--outline w-100">
      <table className="w-100 collapse">
        <thead>
          <tr>
            <th className="h3 tl ph3 lh-copy">
              <Trans>Note</Trans>
            </th>
            <th className="h3 tl ph3 lh-copy">
              <Trans>Model type</Trans>
            </th>
            <th className="h3 tl ph3 lh-copy">
              <Trans>Flashcards</Trans>
            </th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => {
            let noteIdentifier = note.id

            if (note.model.primaryField) {
              const contentState = convertFromRaw(
                note.values.find(
                  (value) => value.field?.id === note.model.primaryField?.id
                )?.data as RawDraftContentState
              )

              noteIdentifier = contentState.getPlainText()
            }

            return (
              <tr key={note.id} className="bt b--outline">
                <td className="ph3 pv2">{noteIdentifier}</td>
                <td className="ph3 pv2">{note.model.name}</td>
                <td className="ph3 pv2">{note.cards.length}</td>
                <td className="ph3 pv2">
                  <Menu>
                    <MenuButton icon className="flex items-center">
                      <Icon aria-label={i18n._(t`Actions`)} icon="more_vert" />
                    </MenuButton>
                    <MenuList>
                      <MenuLink to={`/d/${deckSlug}/note/${note.id}`}>
                        <Trans>Edit</Trans>
                      </MenuLink>
                      <MenuItem onSelect={() => console.log('delete')}>
                        <Trans>Delete</Trans>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default NotesTable
