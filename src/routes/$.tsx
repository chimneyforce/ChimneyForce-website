import { createFileRoute } from '@tanstack/react-router';
import { NotFound, notFoundHead } from '../pages/NotFound';

export const Route = createFileRoute('/$')({
  head: notFoundHead,
  component: NotFound,
});
