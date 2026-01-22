import PersonDetailContent from "./(components)/PersonDetailContent";
import { getPersonBySlug } from "@/lib/api/persons";

export default async function PersonDetailPage({ params }) {
  const { locale, slug } = await params;

  // Fetch person data from API
  const person = await getPersonBySlug(slug, locale);

  if (!person) {
    return (
      <div className="wrapper mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-700">
          {locale === 'az' ? 'Şəxs tapılmadı' : 'Person not found'}
        </h1>
      </div>
    );
  }

  return <PersonDetailContent person={person} locale={locale} />;
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const person = await getPersonBySlug(slug, locale);

  if (!person) {
    return {
      title: locale === 'az' ? 'Şəxs tapılmadı' : 'Person not found',
    };
  }

  const name = person.name?.[locale] || person.name?.az || '';
  const position = person.position?.[locale] || person.position?.az || '';

  return {
    title: `${name} - ${position}`,
    description: person.bio?.[locale] || position,
  };
}
