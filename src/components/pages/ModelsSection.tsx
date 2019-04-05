import MaterialIcon from '@material/react-material-icon'
import Fab from '@material/react-fab'
import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

import ModelList from '../ModelList'

const ModelsSection: React.FunctionComponent<RouteComponentProps> = ({
  history,
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
    </>
  )
}

export default withRouter(ModelsSection)
