import { createFileRoute } from '@tanstack/react-router';
import { ServiceDetail, serviceDetailHead } from '../../pages/ServiceDetail';

export const Route = createFileRoute('/services/$slug')({
  head: ({ params }) => serviceDetailHead(params.slug, `/services/${params.slug}`),
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useParams();
  return <ServiceDetail slug={slug} />;
}
