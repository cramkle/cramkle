import { useQuery } from '@apollo/react-hooks'
import { Trans, t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Select, { Option } from '@material/react-select'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { useParams } from 'react-router'

import BackButton from 'components/BackButton'
import FieldValueEditor from 'components/FieldValueEditor'
import Button from 'views/Button'
import Container from 'views/Container'
import { Body2, Caption, Headline5, Subtitle1 } from 'views/Typography'
import useTopBarLoading from 'hooks/useTopBarLoading'
import {
  NoteFormQuery,
  NoteFormQueryVariables,
} from './__generated__/NoteFormQuery'

const MODELS_QUERY = gql`
  query NoteFormQuery($slug: String!) {
    deck(slug: $slug) {
      title
    }
    cardModels {
      id
      name
      fields {
        id
        name
      }
    }
  }
`

const AddNotePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const {
    data: { cardModels: models, deck },
    loading,
  } = useQuery<NoteFormQuery, NoteFormQueryVariables>(MODELS_QUERY, {
    variables: { slug },
  })

  const { i18n } = useLingui()
  const [selectedModelId, setSelectedModelId] = useState('')

  useTopBarLoading(loading)

  if (loading) {
    return null
  }

  const selectedModel = models.find(model => model.id === selectedModelId)

  if (!models.length) {
    return (
      <Container>
        <Headline5>
          <Trans>You haven't created any models yet.</Trans>
        </Headline5>
      </Container>
    )
  }

  return (
    <Container>
      <BackButton />

      <Headline5>
        <Trans>Create Note for deck "{deck.title}"</Trans>
      </Headline5>

      <div className="flex flex-column mt3">
        {
          // @ts-ignore
          <Select
            label={i18n._(t`Select a model`)}
            value={selectedModelId}
            onChange={e =>
              setSelectedModelId((e.target as HTMLSelectElement).value)
            }
          >
            <Option value="" disabled />
            {models.map(model => (
              <Option key={model.id} value={model.id}>
                {model.name}
              </Option>
            ))}
          </Select>
        }

        {selectedModelId !== '' && (
          <>
            <Subtitle1 className="mt2">
              <Trans>Fields</Trans>
            </Subtitle1>

            {selectedModel.fields.length > 0 ? (
              <>
                {selectedModel.fields.map(field => (
                  <React.Fragment key={field.id}>
                    <Caption className="mt3" key={field.id}>
                      {field.name}
                    </Caption>

                    <FieldValueEditor className="mt1" />
                  </React.Fragment>
                ))}

                <Button raised className="mt3 self-start">
                  <Trans>Add Note</Trans>
                </Button>
              </>
            ) : (
              <Body2 className="mt2">
                <Trans>
                  The selected model doesn't have any fields. Please, select
                  another one
                </Trans>
              </Body2>
            )}
          </>
        )}
      </div>
    </Container>
  )
}

export default AddNotePage
