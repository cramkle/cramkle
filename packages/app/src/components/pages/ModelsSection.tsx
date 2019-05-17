import { t } from '@lingui/macro'
import { I18n } from '@lingui/react'
import Icon from '@material/react-material-icon'
import Fab from '@material/react-fab'
import classNames from 'classnames'
import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

import ModelList from '../ModelList'
import { useHints } from '../HintsContext'

import styles from './ModelsSection.css'

const ModelsSection: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  const { isMobile } = useHints()

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
        </>
      )}
    </I18n>
  )
}

export default withRouter(ModelsSection)
