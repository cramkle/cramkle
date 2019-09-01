import React from 'react'

import styles from './CircularProgress.scss'

const CircularProgress: React.FC = () => {
  return (
    <div className={styles.spinner}>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinnerLayer}>
          <div
            className={`${styles.spinnerCircleClipper} ${styles.spinnerLeft}`}
          >
            <div className={styles.spinnerCircle}></div>
          </div>
          <div className={styles.spinnerGapPatch}>
            <div className={styles.spinnerCircle}></div>
          </div>
          <div
            className={`${styles.spinnerCircleClipper} ${styles.spinnerRight}`}
          >
            <div className={styles.spinnerCircle}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircularProgress
