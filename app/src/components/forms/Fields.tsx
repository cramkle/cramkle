import { useField } from 'formik'
import React from 'react'

import Checkbox, { CheckboxProps, CheckboxRef } from '../views/Checkbox'
import { HelperText, Input, Label, LabelProps, Textarea } from '../views/Input'

interface TextInputProps extends LabelProps {
  label: string
  type?: string
  id?: string
  name: string
  textarea?: boolean
}

export const TextInputField = ({
  type = 'text',
  id,
  label,
  name,
  textarea = false,
  ...props
}: TextInputProps) => {
  const [field, meta] = useField(name)

  return (
    <Label {...props} text={label}>
      {textarea ? (
        <Textarea id={id} name={name} {...field} />
      ) : (
        <Input id={id} type={type} name={name} {...field} />
      )}
      {meta.touched && meta.error ? (
        <HelperText>{meta.error}</HelperText>
      ) : null}
    </Label>
  )
}

type CheckboxFieldProps = { value?: string } & Pick<
  CheckboxProps,
  | 'name'
  | 'children'
  | 'onChange'
  | 'checked'
  | 'indeterminate'
  | 'nativeControlId'
>

const CheckboxFieldRender: React.RefForwardingComponent<
  CheckboxRef,
  CheckboxFieldProps
> = (props, ref) => {
  const [field] = useField({
    name: props.name,
    type: 'checkbox',
    value: props.value,
  })

  return <Checkbox {...field} {...props} ref={ref} />
}

export const CheckboxField = React.forwardRef(CheckboxFieldRender)
