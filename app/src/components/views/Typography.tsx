import classNames from 'classnames'
import React from 'react'

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  className?: string
  tag?: keyof React.ReactHTML
}

interface EnhancedProps {
  tag: keyof React.ReactHTML
  classSuffix: string
}

const typography = (options: EnhancedProps) => {
  const { tag: defaultTag, classSuffix } = options

  const Typography: React.FC<TypographyProps> = ({
    children,
    className = '',
    tag: Tag = defaultTag,
    ...otherProps
  }) => {
    const classes = classNames(
      'mdc-typography',
      `mdc-typography--${classSuffix}`,
      className
    )

    return (
      <Tag className={classes} {...otherProps}>
        {children}
      </Tag>
    )
  }

  return Typography
}

export const Body1 = typography({
  classSuffix: 'body1',
  tag: 'p',
})

export const Body2 = typography({
  classSuffix: 'body2',
  tag: 'p',
})

export const Button = typography({
  classSuffix: 'button',
  tag: 'span',
})

export const Caption = typography({
  classSuffix: 'caption',
  tag: 'span',
})

export const Headline1 = typography({
  classSuffix: 'headline1',
  tag: 'h1',
})

export const Headline2 = typography({
  classSuffix: 'headline2',
  tag: 'h2',
})

export const Headline3 = typography({
  classSuffix: 'headline3',
  tag: 'h3',
})

export const Headline4 = typography({
  classSuffix: 'headline4',
  tag: 'h4',
})

export const Headline5 = typography({
  classSuffix: 'headline5',
  tag: 'h5',
})

export const Headline6 = typography({
  classSuffix: 'headline6',
  tag: 'h6',
})

export const Overline = typography({
  classSuffix: 'overline',
  tag: 'span',
})

export const Subtitle1 = typography({
  classSuffix: 'subtitle1',
  tag: 'h6',
})

export const Subtitle2 = typography({
  classSuffix: 'subtitle2',
  tag: 'h6',
})
