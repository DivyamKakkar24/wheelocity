import Chip, { ChipProps } from '@mui/material/Chip';

/** Project-standard chip — wraps MUI Chip for tags, filters, and status badges. */
export default function AppChip({ size = 'small', ...rest }: ChipProps) {
  return <Chip size={size} {...rest} />;
}
