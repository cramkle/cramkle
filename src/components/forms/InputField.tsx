import React from 'react'
import { Field, FieldProps, FieldConfig } from 'formik'
import TextField, { Input, HelperText } from '@material/react-text-field'

interface InputFieldProps {
  className?: string
  label: string
}

interface FieldComponentProps extends FieldProps, InputFieldProps {
  type?: string
}

const InputFieldComponent: React.FunctionComponent<FieldComponentProps> = ({
  field,
  form: { touched, errors },
  type,
  ...fieldProps
}) => (
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

InputFieldComponent.defaultProps = {
  type: 'text',
}

const InputField: React.FunctionComponent<
  InputFieldProps & FieldConfig
> = props => <Field {...props} component={InputFieldComponent} />

export default InputField
