import Link from "next/link";
import { getHome } from "@/lib/api";

export default async function Home() {
  let latestEvents: Awaited<ReturnType<typeof getHome>>["latest_events"] = [];

  try {
    const data = await getHome();
    latestEvents = data.latest_events;
  } catch {
    // API fora do ar não deve quebrar a home
  }

  const featured = latestEvents[0];
  const featuredCover = featured?.photos[0];

  return (
    <div className="grid gap-16 py-16 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-12">
      <section className="max-w-2xl">
        <span className="text-sm text-accent">Fotografia</span>
        <h1 className="mt-3 font-display text-5xl italic leading-[1.05] sm:text-7xl">
          Imagens que ficam.
        </h1>
        <p className="mt-6 max-w-md text-base text-muted sm:text-lg">
          Retratos, eventos e paisagens registrados por CocadaJak. Cada
          trabalho é uma tentativa de guardar um instante direito.
        </p>
        <div className="mt-8 flex gap-6 text-sm">
          <Link
            href="/portfolio"
            className="border-b border-accent pb-1 text-accent transition-colors hover:border-foreground hover:text-foreground"
          >
            Ver o portfólio completo
          </Link>
          <Link
            href="/contato"
            className="border-b border-border pb-1 text-muted transition-colors hover:border-foreground hover:text-foreground"
          >
            Fazer um orçamento
          </Link>
        </div>
      </section>

      {featured && featuredCover && (
        <Link href={`/portfolio?highlight=${featured.id}`} className="group block">
          <figure className="overflow-hidden">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${featuredCover.thumbnail_path ?? featuredCover.image_path}`}
              alt={featured.title}
              className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <figcaption className="mt-3 flex items-baseline justify-between text-sm">
              <span className="transition-colors group-hover:text-foreground">
                {featured.title}
              </span>
              {featured.category && (
                <span className="text-muted">{featured.category.name}</span>
              )}
            </figcaption>
          </figure>
        </Link>
      )}
    </div>
  );
}