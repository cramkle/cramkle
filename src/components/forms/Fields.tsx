import { useField } from 'formik'
import { forwardRef, memo, useCallback } from 'react'

import { Checkbox, CheckboxProps } from '../views/Checkbox'
import {
  HelperText,
  Input,
  InputProps,
  Label,
  Textarea,
  TextareaProps,
} from '../views/Input'

type TextInputProps = {
  label?: string
  type?: string
  id?: string
  name: string
  checkbox?: boolean
  className?: string
} & (({ textarea: true } & TextareaProps) | ({ textarea?: false } & InputProps))

export const TextInputField = memo(function TextInputField(
  props: TextInputProps
) {
  const [field, meta] = useField(props.name)

  let content

  if (props.textarea) {
    const {
      className,
      label,
      type,
      id,
      name,
      checkbox,
      textarea,
      ...inputProps
    } = props
    content = <Textarea {...inputProps} id={id} {...field} name={name} />
  } else {
    const {
      className,
      label,
      type,
      id,
      name,
      checkbox,
      textarea,
      ...inputProps
    } = props
    content = (
      <Input {...inputProps} id={id} type={type} {...field} name={name} />
    )
  }

  content = (
    <>
      {content}{' '}
      {meta.touched && meta.error ? (
        <HelperText variation="error">{meta.error}</HelperText>
      ) : null}
    </>
  )

  return props.label ? (
    <Label
      className={props.className}
      text={props.label}
      checkbox={props.checkbox}
    >
      {content}
    </Label>
  ) : (
    <div className={props.className}>{content}</div>
  )
})

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxProps>(
  function CheckboxField(props, ref) {
    const [field] = useField({
      name: props.name ?? '',
      type: 'checkbox',
      checked: props.checked === 'mixed' ? false : props.checked,
      value: props.value,
    })

    const handleChange = useCallback<
      React.ChangeEventHandler<HTMLInputElement>
    >(
      (evt) => {
        evt.persist()

        field.onChange(props.name)(evt)
      },
      [props.name, field]
    )

    return <Checkbox {...props} {...field} onChange={handleChange} ref={ref} />
  }
)
