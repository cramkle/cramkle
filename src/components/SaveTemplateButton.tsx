import Button from '@material/react-button'
import { RawDraftContentState } from 'draft-js'
import React, { useState } from 'react'
import { graphql, ChildMutateProps } from 'react-apollo'

import updateContentStateMutation from '../graphql/updateContentStateMutation.gql'
import {
  UpdateContentStateMutation,
  UpdateContentStateMutationVariables,
} from '../graphql/__generated__/UpdateContentStateMutation'

type Props = RawDraftContentState & { id: string }

const SaveTemplateButton: React.FunctionComponent<
  ChildMutateProps<
    Props,
    UpdateContentStateMutation,
    UpdateContentStateMutationVariables
  >
> = ({ id, blocks, entityMap, mutate }) => {
  const [loading, setLoading] = useState(false)

  return (
    <Button
      onClick={() => {
        setLoading(true)
        mutate({
          variables: { id, contentState: { blocks, entityMap } },
        }).finally(() => setLoading(false))
      }}
      disabled={loading}
      dense
    >
      Save Template
    </Button>
  )
}

export default graphql<Props>(updateContentStateMutation)(SaveTemplateButton)
