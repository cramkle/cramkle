import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import classNames from 'classnames'
import { useHints } from 'components/HintsContext'
import ModelList from 'components/ModelList'
import React from 'react'
import { useHistory } from 'react-router'
import Fab from 'views/Fab'
import Icon from 'views/Icon'

import styles from './ModelsSection.css'

const ModelsSection: React.FunctionComponent = () => {
  const history = useHistory()
  const { i18n } = useLingui()
  const { isMobile } = useHints()

  const handleAddClick = () => {
    history.push('/models/create')
  }

  return (
    <>
      <ModelList />

      <div className={classNames(styles.fab, 'fixed z-1')}>
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

export default ModelsSection
