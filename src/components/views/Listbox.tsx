import type {
  ListboxButtonProps as ButtonProps,
  ListboxInputProps as InputProps,
  ListboxListProps as ListProps,
  ListboxProps,
  ListboxOptionProps as OptionProps,
  ListboxPopoverProps as PopoverProps,
} from '@reach/listbox'
import {
  ListboxButton as Button,
  ListboxInput as Input,
  ListboxList as List,
  ListboxOption as Option,
  ListboxPopover as Popover,
} from '@reach/listbox'
import classnames from 'classnames'
import { forwardRef } from 'react'
import * as React from 'react'

import { ArrowDownIcon } from '../icons/ArrowDownIcon'
import { DoneIcon } from '../icons/DoneIcon'
import styles from './Listbox.module.css'

export const ListboxInput = forwardRef<
  HTMLDivElement,
  InputProps & { className?: string; id?: string }
>(function ListboxInput({ className, ...props }, ref) {
  return <Input {...props} className={classnames(className)} ref={ref} />
})

export const ListboxButton: React.FC<
  Omit<ButtonProps, 'arrow'> & React.HTMLAttributes<HTMLSpanElement>
> = ({ className, ...props }) => {
  return (
    <Button
      {...props}
      arrow={<ArrowDownIcon />}
      className={classnames(
        styles.button,
        className,
        'outline-reset inline-flex items-center justify-between select-none cursor-default bg-input text-on-surface rounded border border-divider border-opacity-divider px-3 py-2 focus:border-primary'
      )}
    />
  )
}

export const ListboxPopover = forwardRef<
  HTMLDivElement,
  PopoverProps & { className?: string }
>(function ListboxPopover({ className, children, ...props }, ref) {
  return (
    <Popover
      {...props}
      className={classnames(
        styles.popover,
        className,
        'absolute z-50 border-0 border-none rounded shadow-xl bg-surface py-0 mt-1 outline-none'
      )}
      ref={ref}
    >
      <div className="py-2 h-full shadow-sm rounded">{children}</div>
    </Popover>
  )
})

export const ListboxList: React.FC<
  ListProps & React.HTMLAttributes<HTMLUListElement>
> = ({ className, ...props }) => {
  return <List {...props} className={classnames(className, 'outline-none')} />
}

export const ListboxOption: React.FC<
  OptionProps & React.LiHTMLAttributes<HTMLLIElement>
> = ({ className, children, disabled, ...props }) => {
  return (
    <Option
      {...props}
      disabled={disabled ?? false}
      className={classnames(
        className,
        styles.option,
        'flex items-center bg-surface text-on-surface relative p-2 mx-2 rounded overflow-hidden whitespace-nowrap',
        { 'text-txt text-opacity-text-disabled': disabled }
      )}
    >
      <DoneIcon className={classnames(styles.optionIcon, 'hidden h-4 pr-2')} />
      <span className="font-normal flex-1 max-w-full">{children}</span>
      <div
        className={classnames(
          styles.optionBackdrop,
          'z-0 top-0 bottom-0 left-0 right-0 bg-primary'
        )}
      />
    </Option>
  )
}

export const Listbox = forwardRef<
  HTMLDivElement,
  Omit<ListboxProps, 'arrow'> & { className?: string; id?: string }
>(function Listbox(
  { className = '', button, children, portal = true, ...props },
  forwardedRef
) {
  return (
    <ListboxInput className={className} {...props} ref={forwardedRef}>
      {({ value, valueLabel }) => (
        <>
          <ListboxButton>
            {button
              ? typeof button === 'function'
                ? button({ value, label: valueLabel })
                : button
              : undefined}
          </ListboxButton>
          <ListboxPopover portal={portal}>
            <ListboxList>{children}</ListboxList>
          </ListboxPopover>
        </>
      )}
    </ListboxInput>
  )
})
