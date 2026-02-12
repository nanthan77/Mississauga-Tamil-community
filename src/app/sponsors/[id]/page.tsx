import SponsorDetailClient from './SponsorDetailClient';

// Generate static params for default sponsor IDs
export function generateStaticParams() {
  // Generate params for IDs 1-20 to cover default and potential new sponsors
  return Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
  }));
}

export default async function SponsorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SponsorDetailClient sponsorId={id} />;
}
