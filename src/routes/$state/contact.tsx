import { createFileRoute } from '@tanstack/react-router';
import { Contact, contactHead } from '../../pages/Contact';
import { NotFound, notFoundHead } from '../../pages/NotFound';
import { isStateSlug } from '../../context/RegionContext';

export const Route = createFileRoute('/$state/contact')({
  head: ({ params }) =>
    isStateSlug(params.state.toLowerCase()) ? contactHead(`/${params.state}/contact`) : notFoundHead(),
  component: StateContact,
});

function StateContact() {
  const { state } = Route.useParams();
  return isStateSlug(state.toLowerCase()) ? <Contact /> : <NotFound />;
}
