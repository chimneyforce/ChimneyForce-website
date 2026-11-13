import { createFileRoute } from '@tanstack/react-router';
import { About, aboutHead } from '../../pages/About';
import { NotFound, notFoundHead } from '../../pages/NotFound';
import { isStateSlug } from '../../context/RegionContext';

export const Route = createFileRoute('/$state/about')({
  head: ({ params }) => (isStateSlug(params.state.toLowerCase()) ? aboutHead(`/${params.state}/about`) : notFoundHead()),
  component: StateAbout,
});

function StateAbout() {
  const { state } = Route.useParams();
  return isStateSlug(state.toLowerCase()) ? <About /> : <NotFound />;
}
