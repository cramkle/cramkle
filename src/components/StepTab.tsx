import { Trans } from '@lingui/macro'
import { forwardRefWithAs } from '@reach/utils'
import classnames from 'classnames'

const StepTab = forwardRefWithAs<
  { isActive?: boolean; children?: React.ReactNode; index: number },
  'button'
>(function StepTab(
  { children, className = '', isActive = false, index, ...props },
  ref
) {
  return (
    <button
      {...props}
      type="button"
      ref={ref}
      role="presentation"
      className={classnames(
        className,
        'group outline-reset font-medium text-sm relative capitalize px-0 py-4 inline-flex justify-start items-center border-solid border-l-0 border-r-0 border-b-0 border-t-4 cursor-default',
        {
          'border-primary': isActive,
          'border-secondary': !isActive,
        }
      )}
    >
      <div className="flex flex-col text-left">
        <span
          className={classnames('uppercase text-sm font-semibold', {
            'text-primary': isActive,
            'text-txt text-opacity-text-disabled': !isActive,
          })}
        >
          <Trans>Step {index + 1}</Trans>
        </span>
        <span className="inline-block mt-1 text-txt text-opacity-text-primary">
          {children}
        </span>
      </div>
    </button>
  )
})

export default StepTab
