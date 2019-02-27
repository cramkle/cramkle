import React from 'react'
import { Field, FieldProps, FieldConfig } from 'formik'
import TextField, { Input, HelperText } from '@material/react-text-field'

interface FieldComponentProps extends FieldProps {
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

interface InputFieldProps extends FieldConfig {
  className?: string
  label?: string
}

const InputField: React.FunctionComponent<InputFieldProps> = props => (
  <Field {...props} component={InputFieldComponent} />
)

export default InputField
