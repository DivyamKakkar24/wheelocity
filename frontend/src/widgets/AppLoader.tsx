import Box from '@mui/material/Box';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';

export interface AppLoaderProps extends CircularProgressProps {
  /** Centers the spinner in a full-height flex container when true (default). */
  centered?: boolean;
}

/** Project-standard loader — wraps MUI CircularProgress, optionally centered on the page. */
export default function AppLoader({ centered = true, ...rest }: AppLoaderProps) {
  if (!centered) return <CircularProgress {...rest} />;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%">
      <CircularProgress {...rest} />
    </Box>
  );
}
