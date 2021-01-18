import classNames from 'classnames'
import { ReactNode } from 'react'

import styles from './GeneralSettings.css'
import { Subtitle2 } from './views/Typography'

interface Props {
  className?: string
  children?: ReactNode
  title?: ReactNode
  description?: ReactNode
  id?: string
}

export default function SettingItem({
  id,
  className,
  children,
  title,
  description,
}: Props) {
  return (
    <div
      className={classNames(
        styles.settingItem,
        className,
        'grid items-center sm:items-start'
      )}
    >
      <label htmlFor={id} className="flex flex-col">
        <span>{title}</span>
      </label>
      {description && (
        <Subtitle2
          className={classNames(
            styles.settingDescription,
            'mt-2 sm:mt-1 text-txt text-opacity-text-secondary'
          )}
        >
          {description}
        </Subtitle2>
      )}
      <div className={classNames(styles.settingInput, 'ml-2 self-center')}>
        {children}
      </div>
    </div>
  )
}
