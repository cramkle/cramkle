import Button from '@material/react-button'
import React, { useState } from 'react'
import { graphql, ChildMutateProps } from 'react-apollo'

import { APIContentState } from '../types/APIContentState'
import updateContentStateMutation from '../graphql/updateContentStateMutation.gql'

const SaveTemplateButton: React.FunctionComponent<
  ChildMutateProps<APIContentState>
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

export default graphql<APIContentState>(updateContentStateMutation)(
  SaveTemplateButton
)
