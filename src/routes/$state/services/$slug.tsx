import { createFileRoute } from '@tanstack/react-router';
import { ServiceDetail, serviceDetailHead } from '../../../pages/ServiceDetail';
import { NotFound, notFoundHead } from '../../../pages/NotFound';
import { isStateSlug } from '../../../context/RegionContext';

export const Route = createFileRoute('/$state/services/$slug')({
  head: ({ params }) =>
    isStateSlug(params.state.toLowerCase())
      ? serviceDetailHead(params.slug, `/${params.state}/services/${params.slug}`)
      : notFoundHead(),
  component: StateServicePage,
});

function StateServicePage() {
  const { state, slug } = Route.useParams();
  return isStateSlug(state.toLowerCase()) ? <ServiceDetail slug={slug} /> : <NotFound />;
}
