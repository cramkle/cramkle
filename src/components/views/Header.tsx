import classnames from 'classnames'
import React from 'react'

export const Header: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => {
  return (
    <header
      className={classnames(
        props.className,
        'bg-surface border-b border-gray-1'
      )}
    >
      {props.children}
    </header>
  )
}

export const HeaderContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props
) => {
  return (
    <div className={classnames(props.className, 'h-16 flex shadow-xs')}>
      {props.children}
    </div>
  )
}

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  align?: 'start' | 'center' | 'end'
}

export const HeaderSection: React.FC<SectionProps> = ({
  align = 'start',
  ...props
}) => {
  return (
    <section
      className={classnames(
        props.className,
        'flex-auto inline-flex items-center py-2 px-3',
        `justify-${align}`
      )}
    >
      {props.children}
    </section>
  )
}
