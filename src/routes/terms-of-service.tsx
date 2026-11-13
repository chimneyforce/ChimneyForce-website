import { createFileRoute } from '@tanstack/react-router';
import { TermsOfService, termsOfServiceHead } from '../pages/TermsOfService';

export const Route = createFileRoute('/terms-of-service')({
  head: termsOfServiceHead,
  component: TermsOfService,
});
