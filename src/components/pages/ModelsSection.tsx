import MaterialIcon from '@material/react-material-icon'
import Fab from '@material/react-fab'
import { Snackbar } from '@material/react-snackbar'
import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

import ModelList from '../ModelList'

const ModelsSection: React.FunctionComponent<RouteComponentProps> = ({
  history,
  location,
}) => {
  const handleAddClick = () => {
    history.push('/models/create')
  }

  return (
    <>
      <ModelList />

      <div className="fixed right-0 bottom-0 pa4">
        <Fab
          icon={<MaterialIcon icon="add" />}
          textLabel="Add model"
          onClick={handleAddClick}
        />
      </div>

      {location.state && location.state.newModel && (
        <Snackbar
          message="Model created successfully"
          actionText="view"
          leading
          onClose={(closeReason: string) => {
            if (closeReason !== 'action') {
              return
            }

            history.push(`/m/${location.state.newModel}`)
          }}
        />
      )}
    </>
  )
}

export default withRouter(ModelsSection)
