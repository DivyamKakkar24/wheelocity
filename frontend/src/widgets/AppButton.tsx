import Button, { type ButtonProps } from '@mui/material/Button';

export interface AppButtonProps extends ButtonProps {
  loading?: boolean;
}

/** Project-standard button — wraps MUI Button with sensible defaults. */
export default function AppButton({
  variant = 'contained',
  color = 'primary',
  loading = false,
  disabled,
  children,
  ...rest
}: AppButtonProps) {
  return (
    <Button variant={variant} color={color} disabled={disabled || loading} {...rest}>
      {loading ? 'Loading…' : children}
    </Button>
  );
}
