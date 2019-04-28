import Checkbox, { CheckboxProps } from '@material/react-checkbox'
import TextField, {
  Input,
  HelperText,
  Props as TextFieldProps,
} from '@material/react-text-field'
import { useField } from 'formik'
import React from 'react'

interface TextInputProps<T extends HTMLElement>
  extends Pick<
    TextFieldProps<T>,
    Exclude<keyof TextFieldProps<T>, 'children'>
  > {
  label: string
  type?: string
  id?: string
  name: string
}

export const TextInputField = <T extends HTMLElement>({
  type = 'text',
  id,
  name,
  ...props
}: TextInputProps<T>) => {
  const [field, meta] = useField(name)

  return (
    <TextField<T>
      {...props}
      helperText={
        meta.touched && meta.error ? (
          <HelperText validation persistent>
            {meta.error}
          </HelperText>
        ) : null
      }
    >
      <Input id={id} type={type} name={name} {...field} />
    </TextField>
  )
}

type CheckboxFieldProps = Pick<
  CheckboxProps,
  | 'name'
  | 'children'
  | 'onChange'
  | 'checked'
  | 'indeterminate'
  | 'nativeControlId'
>

export const CheckboxField: React.FunctionComponent<
  CheckboxFieldProps
> = props => {
  const [field] = useField(props.name)

  return <Checkbox checked={field.value} {...field} {...props} />
}
