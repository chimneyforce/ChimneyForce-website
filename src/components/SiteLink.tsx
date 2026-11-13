import { Link, type LinkComponentProps } from '@tanstack/react-router';

type SiteLinkProps = Omit<LinkComponentProps<'a'>, 'to'> & { to: string };

// Region-prefixed paths are built at runtime, so they can't satisfy the typed route union.
export const SiteLink = ({ to, ...props }: SiteLinkProps) => <Link {...props} to={to as '/'} />;
