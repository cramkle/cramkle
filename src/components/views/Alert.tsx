import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import type { AlertProps as ReachAlertProps } from '@reach/alert'
import { Alert as ReachAlert } from '@reach/alert'
import type * as Polymorphic from '@reach/utils/polymorphic'
import classnames from 'classnames'
import { forwardRef } from 'react'

import { DoneIcon } from '../icons/DoneIcon'
import { WarningIcon } from '../icons/WarningIcon'

export interface AlertProps extends ReachAlertProps {
  mode?: 'warning' | 'error' | 'success'
}

export const Alert = forwardRef(function Alert(
  { className, mode = 'warning', children, ...props },
  ref
) {
  const { i18n } = useLingui()

  return (
    <ReachAlert
      className={classnames(
        className,
        'inline-flex items-center bg-opacity-20 rounded-full px-4 py-3 text-txt text-opacity-text-primary',
        {
          'bg-yellow-1': mode === 'warning',
          'bg-green-1': mode === 'success',
          'bg-red-1': mode === 'error',
        }
      )}
      {...props}
      ref={ref}
    >
      {mode === 'success' ? (
        <DoneIcon
          className="text-green-1 flex-shrink-0"
          aria-label={i18n._(t`Success`)}
        />
      ) : (
        <WarningIcon
          className={classnames('flex-shrink-0', {
            'text-yellow-1': mode === 'warning',
            'text-red-1': mode === 'error',
          })}
          aria-label={
            mode === 'warning' ? i18n._(t`Warning`) : i18n._(t`Error`)
          }
        />
      )}
      <div className="ml-3">{children}</div>
    </ReachAlert>
  )
}) as Polymorphic.ForwardRefComponent<'div', AlertProps>
