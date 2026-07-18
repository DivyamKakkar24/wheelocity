import Card, { type CardProps } from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export interface AppCardProps extends CardProps {
  /** Optional padding override for CardContent (default: 2). */
  contentPadding?: number;
}

/** Project-standard card — wraps MUI Card + CardContent with consistent spacing. */
export default function AppCard({ children, contentPadding = 2, ...rest }: AppCardProps) {
  return (
    <Card {...rest}>
      <CardContent sx={{ p: contentPadding, '&:last-child': { pb: contentPadding } }}>
        {children}
      </CardContent>
    </Card>
  );
}
