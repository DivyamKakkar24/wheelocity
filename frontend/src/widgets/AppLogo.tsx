import wheelocityLogo from '@/assets/images/logos/wheelocity-logo.svg';
import wheelocityLogoWhite from '@/assets/images/logos/wheelocity-logo-white.svg';

const LOGO_SRC = {
  dark: wheelocityLogo,
  white: wheelocityLogoWhite,
};

export interface AppLogoProps {
  /** 'dark' (default) for light backgrounds, 'white' for dark backgrounds. */
  variant?: keyof typeof LOGO_SRC;
  /** Rendered height in pixels; width scales automatically (intrinsic ratio 360:104). */
  height?: number;
  className?: string;
}

/** Project-standard logo — canonical Wheelocity wordmark, used across navbar, footer, and sidebar. */
export default function AppLogo({ variant = 'dark', height = 32, className }: AppLogoProps) {
  return <img className={className} src={LOGO_SRC[variant]} alt="Wheelocity" height={height} />;
}
