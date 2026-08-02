import Alert, { type AlertProps } from '@mui/material/Alert';

/** Project-standard alert — wraps MUI Alert for success, error, warning, and info messages. */
export default function AppAlert({ severity = 'info', ...rest }: AlertProps) {
  return <Alert severity={severity} {...rest} />;
}
