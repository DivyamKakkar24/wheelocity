import Avatar, { AvatarProps } from '@mui/material/Avatar';

export interface AppAvatarProps extends AvatarProps {
  /** Display name used to generate initials fallback. */
  name?: string;
}

/** Derives initials from the first two words of a name string. */
function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/** Project-standard avatar — wraps MUI Avatar with automatic initials fallback. */
export default function AppAvatar({ name, children, ...rest }: AppAvatarProps) {
  return <Avatar {...rest}>{children ?? (name ? getInitials(name) : undefined)}</Avatar>;
}
