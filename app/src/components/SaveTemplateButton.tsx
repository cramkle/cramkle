import { useMutation } from '@apollo/react-hooks'
import { Trans } from '@lingui/macro'
import { RawDraftContentState } from 'draft-js'
import gql from 'graphql-tag'
import React, { useState } from 'react'

import Button from 'views/Button'
import {
  UpdateTemplateContentMutation,
  UpdateTemplateContentMutationVariables,
} from './__generated__/UpdateTemplateContentMutation'

type Props = RawDraftContentState & { id: string; isFrontSide: boolean }

const UPDATE_TEMPLATE_MUTATION = gql`
  mutation UpdateTemplateContentMutation(
    $id: ID!
    $frontSide: ContentStateInput
    $backSide: ContentStateInput
  ) {
    updateTemplate(id: $id, frontSide: $frontSide, backSide: $backSide) {
      id
    }
  }
`

const SaveTemplateButton: React.FunctionComponent<Props> = ({
  id,
  isFrontSide,
  blocks,
  entityMap,
}) => {
  const [mutate] = useMutation<
    UpdateTemplateContentMutation,
    UpdateTemplateContentMutationVariables
  >(UPDATE_TEMPLATE_MUTATION)

  const [loading, setLoading] = useState(false)

  return (
    <Button
      onClick={() => {
        setLoading(true)
        mutate({
          variables: {
            id,
            [isFrontSide ? 'frontSide' : 'backSide']: { blocks, entityMap },
          },
        }).finally(() => setLoading(false))
      }}
      disabled={loading}
      dense
    >
      <Trans>Save Template</Trans>
    </Button>
  )
}

export default SaveTemplateButton
