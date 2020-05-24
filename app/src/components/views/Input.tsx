import classnames from 'classnames'
import React, { ReactNode, forwardRef } from 'react'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      {...props}
      ref={ref}
      className={classnames(
        className,
        'mt-2 rounded border border-gray-1 py-2 px-4 focus:border-primary'
      )}
    />
  )
})

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        {...props}
        ref={ref}
        className={classnames(
          className,
          'mt-2 rounded border border-gray-1 py-2 px-4 focus:border-primary'
        )}
      />
    )
  }
)

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  text?: ReactNode
  checkbox?: boolean
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, text, checkbox = false, children, ...props },
  ref
) {
  return (
    <label
      {...props}
      ref={ref}
      className={classnames(className, 'flex', {
        'flex-col': !checkbox,
        'flex-row-reverse items-center': checkbox,
      })}
    >
      <span className="text-primary text-sm">{text}</span>
      {children}
    </label>
  )
})

export interface HelperTextProps extends React.HTMLAttributes<HTMLDivElement> {
  variation?: 'error' | 'success' | 'normal'
}

export const HelperText = forwardRef<HTMLDivElement, HelperTextProps>(
  function HelperText({ className, variation = 'normal', ...props }, ref) {
    return (
      <div
        {...props}
        ref={ref}
        className={classnames('dib mt-1 text-sm', {
          'text-secondary': variation === 'normal',
          'text-red-1': variation === 'error',
          'text-green-1': variation === 'success',
        })}
      />
    )
  }
)
