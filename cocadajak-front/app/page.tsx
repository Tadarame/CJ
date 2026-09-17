import Link from "next/link";
import { getHome } from "@/lib/api";

export default async function Home() {
  let latestPhotos: Awaited<ReturnType<typeof getHome>>["latest_photos"] = [];

  try {
    const data = await getHome();
    latestPhotos = data.latest_photos;
  } catch {
    // API fora do ar não deve quebrar a home — só não mostra a prévia
  }

  return (
    <div className="flex flex-col gap-16 py-16 sm:py-24">
      <section className="max-w-2xl">
        <h1 className="font-display text-4xl italic leading-tight sm:text-6xl">
          Imagens que ficam.
        </h1>
        <p className="mt-6 max-w-md text-base text-muted sm:text-lg">
          Retratos, eventos e paisagens registrados por CocadaJak. Cada
          trabalho é uma tentativa de guardar um instante direito.
        </p>
        <Link
          href="/portfolio"
          className="mt-8 inline-block border-b border-accent pb-1 text-accent transition-colors hover:text-foreground hover:border-foreground"
        >
          Ver o portfólio completo
        </Link>
      </section>

      {latestPhotos.length > 0 && (
        <section>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {latestPhotos.slice(0, 3).map((photo) => (
              <figure key={photo.id} className="overflow-hidden">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${photo.image_path}`}
                  alt={photo.title}
                  loading="lazy"
                  className="h-64 w-full object-cover"
                />
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}