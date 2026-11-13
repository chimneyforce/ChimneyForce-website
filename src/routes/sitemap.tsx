import { createFileRoute } from '@tanstack/react-router';
import { Sitemap, sitemapHead } from '../pages/Sitemap';

export const Route = createFileRoute('/sitemap')({
  head: sitemapHead,
  component: Sitemap,
});
