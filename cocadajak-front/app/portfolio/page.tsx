import { getPortfolio } from "@/lib/api";

export default async function PortfolioPage() {
  const { photos } = await getPortfolio();

  return (
    <div className="py-16 sm:py-24">
      <h1 className="font-display text-3xl italic sm:text-4xl">Portfólio</h1>

      {photos.length === 0 ? (
        <p className="mt-8 text-muted">
          Nenhuma foto publicada ainda. Volte em breve.
        </p>
      ) : (
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photos.map((photo) => (
            <figure key={photo.id} className="mb-4 break-inside-avoid">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${photo.image_path}`}
                alt={photo.title}
                loading="lazy"
                className="w-full"
              />
              <figcaption className="mt-2 flex items-baseline justify-between text-sm">
                <span>{photo.title}</span>
                {photo.category && (
                  <span className="text-muted">{photo.category.name}</span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}