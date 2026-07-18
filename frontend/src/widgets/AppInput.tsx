import TextField, { type TextFieldProps } from '@mui/material/TextField';

/** Project-standard text input — wraps MUI TextField with consistent defaults. */
export default function AppInput({ fullWidth = true, size = 'small', variant = 'outlined', ...rest }: TextFieldProps) {
  return <TextField fullWidth={fullWidth} size={size} variant={variant} {...rest} />;
}
