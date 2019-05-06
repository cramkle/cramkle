import { t } from '@lingui/macro'
import { I18n } from '@lingui/react'
import Icon from '@material/react-material-icon'
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
    <I18n>
      {({ i18n }) => (
        <>
          <ModelList />

          <div className="fixed right-0 bottom-0 pa4">
            <Fab
              icon={<Icon icon="add" aria-hidden="true" />}
              textLabel={i18n._(t`Add model`)}
              onClick={handleAddClick}
            />
          </div>

          {location.state && location.state.newModel && (
            <Snackbar
              message={i18n._(t`Model created successfully`)}
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
      )}
    </I18n>
  )
}

export default withRouter(ModelsSection)
