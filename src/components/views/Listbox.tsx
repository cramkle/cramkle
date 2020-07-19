import {
  ListboxButton as Button,
  ListboxButtonProps as ButtonProps,
  ListboxInput as Input,
  ListboxInputProps as InputProps,
  ListboxList as List,
  ListboxListProps as ListProps,
  ListboxProps,
  ListboxOption as Option,
  ListboxOptionProps as OptionProps,
  ListboxPopover as Popover,
  ListboxPopoverProps as PopoverProps,
} from '@reach/listbox'
import classnames from 'classnames'
import React, { forwardRef } from 'react'

import ArrowDownIcon from '../icons/ArrowDownIcon'
import DoneIcon from '../icons/DoneIcon'
import styles from './Listbox.css'

export const ListboxInput = forwardRef<HTMLDivElement, InputProps>(
  function ListboxInput({ className, ...props }, ref) {
    return <Input {...props} className={classnames(className)} ref={ref} />
  }
)

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
        'inline-flex items-center justify-between select-none cursor-default bg-surface text-on-surface rounded border border-gray-1 px-3 py-2 focus:border-primary'
      )}
    />
  )
}

export const ListboxPopover = forwardRef<HTMLDivElement, PopoverProps>(
  function ListboxPopover({ className, children, ...props }, ref) {
    return (
      <Popover
        {...props}
        className={classnames(
          styles.popover,
          className,
          'absolute z-40 border-0 border-none rounded shadow-lg bg-surface py-0 mt-1 outline-none'
        )}
        ref={ref}
      >
        <div className="py-2 h-full shadow-xs rounded">{children}</div>
      </Popover>
    )
  }
)

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
      disabled={disabled}
      className={classnames(
        className,
        styles.option,
        'flex items-center bg-surface text-on-surface relative pl-2 pr-4 py-2 whitespace-no-wrap',
        { 'text-disabled': disabled }
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

export const Listbox = forwardRef<HTMLDivElement, Omit<ListboxProps, 'arrow'>>(
  function Listbox(
    { button, children, portal = true, ...props },
    forwardedRef
  ) {
    return (
      <ListboxInput {...props} ref={forwardedRef}>
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
  }
)
