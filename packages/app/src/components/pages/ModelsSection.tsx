import { t } from '@lingui/macro'
import { I18n } from '@lingui/react'
import Icon from '@material/react-material-icon'
import Fab from '@material/react-fab'
import { Snackbar } from '@material/react-snackbar'
import classNames from 'classnames'
import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

import ModelList from '../ModelList'
import { useMobile } from '../MobileContext'

import styles from './ModelsSection.css'

const ModelsSection: React.FunctionComponent<RouteComponentProps> = ({
  history,
  location,
}) => {
  const isMobile = useMobile()

  const handleAddClick = () => {
    history.push('/models/create')
  }

  return (
    <I18n>
      {({ i18n }) => (
        <>
          <ModelList />

          <div className={classNames(styles.fab, 'fixed')}>
            <Fab
              icon={<Icon icon="add" aria-hidden="true" />}
              aria-label={i18n._(t`Add model`)}
              textLabel={!isMobile && i18n._(t`Add model`)}
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
