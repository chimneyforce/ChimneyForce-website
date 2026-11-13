import { createFileRoute } from '@tanstack/react-router';
import { About, aboutHead } from '../pages/About';

export const Route = createFileRoute('/about')({
  head: () => aboutHead('/about'),
  component: About,
});
