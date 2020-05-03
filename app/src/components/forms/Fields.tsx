import { useField } from 'formik'
import React, { useCallback } from 'react'

import { Checkbox, CheckboxProps } from '../views/Checkbox'
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
        <HelperText variation="error">{meta.error}</HelperText>
      ) : null}
    </Label>
  )
}

export const CheckboxField = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function CheckboxField(props, ref) {
    const [field] = useField({
      name: props.name,
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
