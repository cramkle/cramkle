import React from 'react'
import { FieldProps } from 'formik'
import TextField, {
  Input,
  HelperText,
  Props as TextFieldProps,
} from '@material/react-text-field'

interface TextInputProps<T> extends FieldProps, TextFieldProps<T> {
  label: string
  type?: string
}

export const TextInput = <T extends {}>({
  field,
  form: { touched, errors },
  type,
  ...fieldProps
}: TextInputProps<T>) => (
  <TextField
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
