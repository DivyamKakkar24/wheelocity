import { useId } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { alpha } from '@mui/material/styles';

/** Project-standard text input — wraps MUI TextField with the label placed above the field instead of floating inside it. */
export default function AppInput({
  fullWidth = true,
  size = 'small',
  variant = 'outlined',
  label,
  id,
  error,
  required,
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <Box sx={{ width: fullWidth ? '100%' : undefined }}>
      {label && (
        <InputLabel
          htmlFor={inputId}
          shrink
          disableAnimation
          error={error}
          required={required}
          sx={{ position: 'static', transform: 'none', mb: 0.5, fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary' }}
        >
          {label}
        </InputLabel>
      )}
      <TextField
        id={inputId}
        fullWidth={fullWidth}
        size={size}
        variant={variant}
        error={error}
        required={required}
        {...rest}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: (theme) => (error ? theme.palette.error.main : alpha(theme.palette.text.primary, 0.23)),
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: (theme) => (error ? theme.palette.error.main : alpha(theme.palette.text.primary, 0.23)),
              borderWidth: '1px',
            },
          },
          ...rest.sx,
        }}
      />
    </Box>
  );
}
