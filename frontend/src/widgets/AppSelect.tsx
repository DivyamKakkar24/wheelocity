import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectProps } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface AppSelectProps extends Omit<SelectProps, 'label'> {
  label: string;
  options: SelectOption[];
  /** Adds an empty "placeholder" option at the top when provided. */
  placeholder?: string;
}

/** Project-standard select — wraps MUI FormControl + Select with typed options. */
export default function AppSelect({
  label,
  options,
  placeholder,
  size = 'small',
  fullWidth = true,
  ...rest
}: AppSelectProps) {
  const labelId = `${label.toLowerCase().replace(/\s+/g, '-')}-label`;

  return (
    <FormControl size={size} fullWidth={fullWidth}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select labelId={labelId} label={label} {...rest}>
        {placeholder && (
          <MenuItem value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
