import { createFileRoute } from '@tanstack/react-router';
import { Home, homeHead } from '../../pages/Home';
import { NotFound, notFoundHead } from '../../pages/NotFound';
import { isStateSlug } from '../../context/RegionContext';

export const Route = createFileRoute('/$state/')({
  head: ({ params }) => (isStateSlug(params.state.toLowerCase()) ? homeHead(`/${params.state}`) : notFoundHead()),
  component: StateHome,
});

function StateHome() {
  const { state } = Route.useParams();
  return isStateSlug(state.toLowerCase()) ? <Home /> : <NotFound />;
}
