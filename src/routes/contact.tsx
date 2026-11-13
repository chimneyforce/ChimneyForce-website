import { createFileRoute } from '@tanstack/react-router';
import { Contact, contactHead } from '../pages/Contact';

export const Route = createFileRoute('/contact')({
  head: () => contactHead('/contact'),
  component: Contact,
});
