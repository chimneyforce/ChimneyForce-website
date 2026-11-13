import { createFileRoute } from '@tanstack/react-router';
import { CityPage, cityPageHead } from '../../pages/CityPage';
import { NotFound, notFoundHead } from '../../pages/NotFound';
import { isStateSlug } from '../../context/RegionContext';

export const Route = createFileRoute('/$state/$city')({
  head: ({ params }) =>
    isStateSlug(params.state.toLowerCase())
      ? cityPageHead(params.city, `/${params.state}/${params.city}`)
      : notFoundHead(),
  component: StateCityPage,
});

function StateCityPage() {
  const { state, city } = Route.useParams();
  return isStateSlug(state.toLowerCase()) ? <CityPage city={city} /> : <NotFound />;
}
