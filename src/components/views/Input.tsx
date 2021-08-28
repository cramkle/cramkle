import classnames from 'classnames'
import type { ReactNode } from 'react'
import { forwardRef, useContext } from 'react'
import * as React from 'react'

const LabelContext = React.createContext<{ label: boolean } | undefined>(
  undefined
)

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  text?: ReactNode
  checkbox?: boolean | undefined
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, text, checkbox = false, children, ...props },
  ref
) {
  return (
    <LabelContext.Provider value={{ label: true }}>
      <label
        {...props}
        ref={ref}
        className={classnames(className, 'flex', {
          'flex-col': !checkbox,
          'flex-row-reverse items-center': checkbox,
        })}
      >
        <span
          className={classnames('text-txt text-opacity-text-primary text-sm')}
        >
          {text}
        </span>
        {children}
      </label>
    </LabelContext.Provider>
  )
})

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = 'text', ...props },
  ref
) {
  const isLabelled = useContext(LabelContext)?.label

  return (
    <input
      {...props}
      ref={ref}
      type={type}
      className={classnames(
        className,
        'bg-input text-txt text-opacity-text-primary rounded border border-divider border-opacity-divider outline-none py-2 px-4 focus:border-primary placeholder-gray-2 leading-snug min-w-0',
        {
          'mt-2': isLabelled,
        }
      )}
    />
  )
})

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    const isLabelled = useContext(LabelContext)?.label

    return (
      <textarea
        {...props}
        ref={ref}
        className={classnames(
          className,
          'bg-input text-txt text-opacity-text-primary rounded border border-divider border-opacity-divider py-2 px-4 focus:border-primary placeholder-gray-2 min-w-0',
          {
            'mt-2': isLabelled,
          }
        )}
      />
    )
  }
)

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
          'text-txt text-opacity-text-secondary': variation === 'normal',
          'text-red-1': variation === 'error',
          'text-green-1': variation === 'success',
        })}
      />
    )
  }
)
