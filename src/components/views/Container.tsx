import classnames from 'classnames'
import * as React from 'react'

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  lean?: boolean
}

const Container: React.FunctionComponent<ContainerProps> = ({
  children,
  className = '',
  lean = false,
  ...props
}) => {
  return (
    <section
      {...props}
      className={classnames(className, 'px-3 mx-auto container', {
        'py-4': !lean,
      })}
    >
      {children}
    </section>
  )
}

export default Container
