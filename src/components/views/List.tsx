import { forwardRefWithAs } from '@reach/utils'
import classnames from 'classnames'
import type { FC, HTMLAttributes, ReactNode } from 'react'
import { useRef } from 'react'
import { TabController, useControlledTabIndex } from 'react-tab-controller'

import { useId } from '../../hooks/useId'
import { useMergeRefs } from '../../hooks/useMergeRefs'

export const List: FC<HTMLAttributes<HTMLUListElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <TabController>
      <ul
        {...props}
        className={classnames(className, 'flex flex-col p-0 space-y-4')}
      >
        {children}
      </ul>
    </TabController>
  )
}

interface ListItemProps {
  icon?: ReactNode
  disabled?: boolean
}

export const ListItem = forwardRefWithAs<ListItemProps, 'div'>(
  function ListItem(
    { icon, children, className, disabled = false, as: As = 'div', ...props },
    propRef
  ) {
    const id = useId()
    const ref = useRef(null)

    const { tabIndex, onKeyDown } = useControlledTabIndex(ref, id, disabled)

    const elementRef = useMergeRefs(propRef, ref)

    return (
      // @ts-ignore
      <li>
        <As
          {...props}
          className={classnames(
            className,
            'relative group z-10 flex items-center px-3 py-2 outline-reset rounded overflow-hidden transition-colors ease-in-out duration-100',
            {
              'text-txt text-opacity-text-primary focus:text-primary hover:text-primary cursor-pointer':
                !disabled,
              'hover:bg-primary focus:bg-primary hover:bg-opacity-12 focus:bg-opacity-12':
                !disabled,
              'text-txt text-opacity-text-disabled': disabled,
            }
          )}
          ref={elementRef}
          tabIndex={tabIndex}
          onKeyDown={onKeyDown}
        >
          <div
            className={classnames('flex-shrink-0', {
              'text-txt text-opacity-text-disabled': disabled,
              'text-txt text-opacity-text-icon': !disabled,
              'group-hover:text-primary group-focus:text-primary group-hover:text-opacity-100 group-focus:text-opacity-100':
                !disabled,
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
        </As>
      </li>
    )
  }
)
