import classnames from 'classnames'
import type { FC } from 'react'

const Container: FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <section
      {...props}
      className={classnames(className, 'px-3 py-4 mx-auto container')}
    >
      {children}
    </section>
  )
}

export default Container
