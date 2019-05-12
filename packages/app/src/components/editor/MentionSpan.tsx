import cx from 'classnames'
import React from 'react'

import styles from './MentionSpan.css'

const MentionSpan: React.FunctionComponent = ({ children }) => {
  return <span className={cx(styles.mention, 'relative')}>{children}</span>
}

export default MentionSpan
