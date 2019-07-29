import cx from 'classnames'
import React from 'react'

import styles from './TagSpan.css'

const TagSpan: React.FunctionComponent = ({ children }) => {
  return <span className={cx(styles.tag, 'relative')}>{children}</span>
}

export default TagSpan
