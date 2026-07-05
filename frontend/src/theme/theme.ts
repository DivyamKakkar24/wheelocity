import { createTheme } from '@mui/material/styles';

// Hex values mirror src/styles/_variables.scss — keep both in sync.
// Palette keys are semantic (usage-based), not color names — e.g. `surfaceInverse`
// not `graphite` — so a future rebrand only touches the hex values, not call sites.
declare module '@mui/material/styles' {
  interface Palette {
    surfaceInverse: { main: string; contrastText: string };
    badgeVerified: { main: string; contrastText: string };
    price: { main: string; contrastText: string };
  }
  interface PaletteOptions {
    surfaceInverse?: { main: string; contrastText: string };
    badgeVerified?: { main: string; contrastText: string };
    price?: { main: string; contrastText: string };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#5EEAD4', // teal — primary CTA, active nav state
      contrastText: '#1E2124',
    },
    surfaceInverse: {
      main: '#1E2124', // graphite — nav, hero, bottom nav
      contrastText: '#FFFFFF',
    },
    badgeVerified: {
      main: '#C9A66B', // gold — verified/trust badges only
      contrastText: '#1E2124',
    },
    price: {
      main: '#1D9E75', // price text
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF', // listing & detail surfaces
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E2124',
      secondary: '#6B7280', // secondary text
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

export default theme;
