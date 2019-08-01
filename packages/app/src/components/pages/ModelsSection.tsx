import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Fab from '@material/react-fab'
import classNames from 'classnames'
import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

import ModelList from '../ModelList'
import Icon from '../views/Icon'
import { useHints } from '../HintsContext'

import styles from './ModelsSection.css'

const ModelsSection: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  const { i18n } = useLingui()
  const { isMobile } = useHints()

  const handleAddClick = () => {
    history.push('/models/create')
  }

  return (
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
  )
}

export default withRouter(ModelsSection)
