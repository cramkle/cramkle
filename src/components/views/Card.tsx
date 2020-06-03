import classNames from 'classnames'
import React, { ReactElement, useRef } from 'react'

import { useRipple } from './Ripple'

const cssClasses = {
  ROOT: 'mdc-card',
  OUTLINED: 'mdc-card--outlined',
  PRIMARY_ACTION: 'mdc-card__primary-action',
  MEDIA: 'mdc-card__media',
  MEDIA_SQUARE: 'mdc-card__media--square',
  MEDIA_16_9: 'mdc-card__media--16-9',
  MEDIA_CONTENT: 'mdc-card__media-content',
  ACTIONS: 'mdc-card__actions',
  ACTIONS_FULL_BLEED: 'mdc-card__actions--full-bleed',
  ACTION_BUTTONS: 'mdc-card__action-buttons',
  ACTION_ICONS: 'mdc-card__action-icons',
  ACTION: 'mdc-card__action',
  ACTION_BUTTON: 'mdc-card__action--button',
  ACTION_ICON: 'mdc-card__action--icon',
}

type TypeWithArray<T> = T | T[]

export interface ActionButtonsProps extends React.HTMLProps<HTMLDivElement> {
  className?: string
  children?: TypeWithArray<
    ReactElement<React.HTMLProps<HTMLButtonElement | HTMLAnchorElement>>
  >
}

export const CardActionButtons: React.FunctionComponent<ActionButtonsProps> = ({
  className = '',
  children,
  ...otherProps
}) => {
  const classes = classNames(cssClasses.ACTION_BUTTONS, className)
  if (!children) {
    return null
  }
  return (
    <div className={classes} {...otherProps}>
      {React.Children.map(children, (item) => {
        if (typeof item !== 'object' || !('props' in item)) {
          return item
        }

        const className = classNames(
          item.props.className,
          cssClasses.ACTION,
          cssClasses.ACTION_BUTTON
        )
        const props = Object.assign({}, item.props, {
          className,
        })
        return React.cloneElement(item, props)
      })}
    </div>
  )
}

type CardActionIconsChild = TypeWithArray<
  ReactElement<React.HTMLProps<HTMLImageElement | HTMLOrSVGElement>>
>

export interface ActionIconsProps extends React.HTMLProps<HTMLDivElement> {
  className?: string
  children?: CardActionIconsChild
}

export const CardActionIcons: React.FunctionComponent<ActionIconsProps> = ({
  className = '',
  children,
  ...otherProps
}) => {
  const classes = classNames(cssClasses.ACTION_ICONS, className)
  if (!children) {
    return null
  }
  return (
    <div className={classes} {...otherProps}>
      {React.Children.map(children, (item) => {
        if (typeof item !== 'object' || !('props' in item)) {
          return item
        }

        const className = classNames(
          item.props.className,
          cssClasses.ACTION,
          cssClasses.ACTION_ICON
        )
        const props = Object.assign({}, item.props, { className })
        return React.cloneElement(item, props)
      })}
    </div>
  )
}

export interface ActionsProps extends React.HTMLProps<HTMLDivElement> {
  className?: string
  fullBleed?: boolean
}

export const CardActions: React.FunctionComponent<ActionsProps> = ({
  className = '',
  children,
  fullBleed = false,
  ...otherProps
}) => {
  const classes = classNames(cssClasses.ACTIONS, className, {
    [cssClasses.ACTIONS_FULL_BLEED]: fullBleed,
  })
  return (
    <div className={classes} {...otherProps}>
      {children}
    </div>
  )
}

export interface MediaProps extends React.HTMLProps<HTMLDivElement> {
  className?: string
  square?: boolean
  wide?: boolean
  contentClassName?: string
  imageUrl?: string
  style?: React.CSSProperties
}

interface MediaChildren {
  children?: React.ReactNode
  contentClassName?: string
}

interface StyleValues {
  imageUrl: string
  style: React.CSSProperties
}

const renderChildren: (
  mediaChildren: MediaChildren
) => React.ReactElement<HTMLDivElement> | undefined = ({
  children,
  contentClassName,
}) => {
  if (!children) {
    return
  }
  const classes = classNames(cssClasses.MEDIA_CONTENT, contentClassName)
  return <div className={classes}>{children}</div>
}

const getStyles: (styleValues: StyleValues) => React.CSSProperties = ({
  imageUrl,
  style,
}) => {
  return Object.assign({}, { backgroundImage: `url(${imageUrl})` }, style)
}

export const CardMedia: React.FunctionComponent<MediaProps> = ({
  className = '',
  contentClassName = '',
  children,
  square = false,
  wide = false,
  imageUrl = '',
  style = {},
  ...otherProps
}) => {
  const classes = classNames(cssClasses.MEDIA, className, {
    [cssClasses.MEDIA_SQUARE]: square,
    [cssClasses.MEDIA_16_9]: wide,
  })

  return (
    <div
      className={classes}
      style={getStyles({ imageUrl, style })}
      {...otherProps}
    >
      {renderChildren({ children, contentClassName })}
    </div>
  )
}

export interface PrimaryContentProps extends React.HTMLProps<HTMLDivElement> {
  className: string
  unbounded?: boolean
}

export const CardPrimaryContent: React.FunctionComponent<PrimaryContentProps> = ({
  className = '',
  style,
  children,
  unbounded,
  ...otherProps
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const { rippleClasses, rippleStyle } = useRipple({
    surfaceRef: ref,
    unbounded,
  })

  const classes = classNames(
    cssClasses.PRIMARY_ACTION,
    className,
    rippleClasses
  )

  return (
    <div
      className={classes}
      ref={ref}
      style={{ ...style, ...rippleStyle }}
      {...otherProps}
    >
      {children}
    </div>
  )
}

export interface CardProps extends React.HTMLProps<HTMLDivElement> {
  className?: string
  outlined?: boolean
}

const Card: React.FunctionComponent<CardProps> = ({
  children,
  className = '',
  outlined = false,
  ...otherProps
}) => {
  const classes = classNames(cssClasses.ROOT, className, {
    [cssClasses.OUTLINED]: outlined,
  })
  return (
    <div className={classes} {...otherProps}>
      {children}
    </div>
  )
}

export default Card
