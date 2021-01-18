import classnames from 'classnames'
import { ReactNode, useRef, useState } from 'react'
import * as React from 'react'
import { TabController, useControlledTabIndex } from 'react-tab-controller'

import useId from '../../hooks/useId'

export const List: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <TabController>
      <ul {...props} className={classnames(className, 'flex flex-col p-0')}>
        {children}
      </ul>
    </TabController>
  )
}

interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  icon?: ReactNode
  disabled?: boolean
}

export const ListItem: React.FC<ListItemProps> = ({
  icon,
  children,
  className,
  disabled = false,
  ...props
}) => {
  const id = useId()
  const ref = useRef<HTMLLIElement>(null)

  const [hover, setHover] = useState(false)
  const [focused, setFocused] = useState(false)

  const { tabIndex, onKeyDown } = useControlledTabIndex(ref, id, disabled)

  const handleMouseEnter = () => {
    setHover(true)
  }

  const handleMouseLeave = () => {
    setHover(false)
  }

  const handleFocus = () => {
    setFocused(true)
  }

  const handleBlur = () => {
    setFocused(false)
  }

  return (
    <li
      {...props}
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={classnames(
        className,
        'relative group z-10 flex items-center px-3 py-2 my-2 outline-reset rounded overflow-hidden transition-colors ease-in-out duration-200',
        {
          'text-txt text-opacity-text-primary focus:text-primary hover:text-primary cursor-pointer': !disabled,
          'text-txt text-opacity-text-disabled': disabled,
        }
      )}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      <div
        className={classnames('flex-shrink-0', {
          'text-txt text-opacity-text-disabled': disabled,
          'text-txt text-opacity-text-icon': (!hover || !focused) && !disabled,
          'text-primary': (hover || focused) && !disabled,
        })}
      >
        {icon}
      </div>
      <span
        className={classnames('inline-block select-none flex-1', {
          'ml-6': !!icon,
        })}
      >
        {children}
      </span>
      <div
        className={classnames(
          'absolute -z-1 top-0 left-0 right-0 bottom-0 bg-primary opacity-0 group-hover:opacity-12 group-focus:opacity-12 transition-opacity ease-in-out duration-200',
          { hidden: disabled }
        )}
      />
    </li>
  )
}
