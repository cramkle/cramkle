import Checkbox, { CheckboxProps } from '@material/react-checkbox'
import TextField, {
  Input,
  HelperText,
  Props as TextFieldProps,
} from '@material/react-text-field'
import { FieldProps } from 'formik'
import React from 'react'

interface TextInputProps<T extends HTMLElement>
  extends FieldProps,
    TextFieldProps<T> {
  label: string
  type?: string
}

export const TextInput = <T extends HTMLElement>({
  field,
  form: { touched, errors },
  type,
  ...fieldProps
}: TextInputProps<T>) => (
  <TextField<T>
    {...fieldProps}
    helperText={
      touched[field.name] && errors[field.name] ? (
        <HelperText validation persistent>
          {errors[field.name]}
        </HelperText>
      ) : null
    }
  >
    <Input type={type} {...field} />
  </TextField>
)

TextInput.defaultProps = {
  type: 'text',
}

export const CheckboxInput: React.FunctionComponent<
  FieldProps<boolean> & CheckboxProps
> = ({ field }) => {
  return <Checkbox checked={field.value} {...field} />
}
