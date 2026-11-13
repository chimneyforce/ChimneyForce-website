import { createFileRoute } from '@tanstack/react-router';
import { PrivacyPolicy, privacyPolicyHead } from '../pages/PrivacyPolicy';

export const Route = createFileRoute('/privacy-policy')({
  head: privacyPolicyHead,
  component: PrivacyPolicy,
});
