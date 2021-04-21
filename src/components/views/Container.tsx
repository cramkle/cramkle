import classnames from 'classnames'
import type { FC } from 'react'

export const Container: FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <section
      {...props}
      className={classnames(
        className,
        'px-2 sm:px-6 md:px-8 mx-auto container'
      )}
    >
      {children}
    </section>
  )
}
