import classnames from 'classnames'
import React from 'react'

const Container: React.FunctionComponent<React.HTMLAttributes<HTMLElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <section
      {...props}
      className={classnames(className, 'p-4 lg:px-8 lg:px-32')}
    >
      {children}
    </section>
  )
}

export default Container
