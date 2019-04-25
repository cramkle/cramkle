import React from 'react'

import styles from './MentionSpan.module.css'

const MentionSpan: React.FunctionComponent<{ decoratedText: string }> = ({
  decoratedText,
}) => {
  return <span className={styles.mention}>{decoratedText}</span>
}

export default MentionSpan
