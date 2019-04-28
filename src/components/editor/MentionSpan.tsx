import React from 'react'

import styles from './MentionSpan.css'

const MentionSpan: React.FunctionComponent = ({ children }) => {
  return <span className={styles.mention}>{children}</span>
}

export default MentionSpan
