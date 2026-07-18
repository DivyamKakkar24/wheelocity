import Checkbox, { type CheckboxProps } from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export interface AppCheckboxProps extends CheckboxProps {
  label: string;
}

/** Project-standard checkbox — wraps MUI Checkbox with an always-present label. */
export default function AppCheckbox({ label, ...rest }: AppCheckboxProps) {
  return <FormControlLabel control={<Checkbox {...rest} />} label={label} />;
}
