import Link from "next/link";
import { getPortfolio, getCategories } from "@/lib/api";
import PhotoGrid from "./PhotoGrid";

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const categoryId = category ? Number(category) : undefined;

  const [{ photos }, { categories }] = await Promise.all([
    getPortfolio(categoryId),
    getCategories(),
  ]);

  return (
    <div className="py-16 sm:py-24">
      <h1 className="font-display text-3xl italic sm:text-4xl">Portfólio</h1>

      <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <Link
          href="/portfolio"
          className={!categoryId ? "text-accent" : "text-muted transition-colors hover:text-foreground"}
        >
          Todas
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/portfolio?category=${cat.id}`}
            className={
              categoryId === cat.id
                ? "text-accent"
                : "text-muted transition-colors hover:text-foreground"
            }
          >
            {cat.name}
          </Link>
        ))}
      </div>
    {photos.length === 0 ? (
      <p className="mt-10 text-muted">Nenhuma foto encontrada nessa categoria.</p>
    ) : (
      <PhotoGrid photos={photos} />
    )}
    </div>
  );
}