import { getAbout } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça CocadaJak e o equipamento usado nos trabalhos.",
  openGraph: {
    title: "Sobre | CocadaJak",
    description: "Conheça CocadaJak e o equipamento usado nos trabalhos.",
  },
};

export default async function SobrePage() {
  const { about, photo_url } = await getAbout();

  return (
    <div className="py-16 sm:py-24">
      <div className="flex flex-col items-center text-center">
        {photo_url && (
          <div className="h-40 w-40 overflow-hidden rounded-full sm:h-52 sm:w-52">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${photo_url}`}
              alt="Foto de CocadaJak"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <h1 className="mt-8 font-display text-3xl italic sm:text-4xl">Sobre</h1>

        {about?.bio && (
          <p className="mt-6 max-w-xl text-muted">{about.bio}</p>
        )}
      </div>

      {(about?.camera || about?.lenses || about?.lighting || about?.editing) && (
        <div className="mx-auto mt-20 max-w-2xl">
          <h2 className="font-display text-2xl italic">Equipamento</h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            {about.camera && (
              <div>
                <dt className="text-sm text-muted">Câmera</dt>
                <dd className="mt-1">{about.camera}</dd>
              </div>
            )}
            {about.lenses && (
              <div>
                <dt className="text-sm text-muted">Lentes</dt>
                <dd className="mt-1">{about.lenses}</dd>
              </div>
            )}
            {about.lighting && (
              <div>
                <dt className="text-sm text-muted">Iluminação</dt>
                <dd className="mt-1">{about.lighting}</dd>
              </div>
            )}
            {about.editing && (
              <div>
                <dt className="text-sm text-muted">Edição</dt>
                <dd className="mt-1">{about.editing}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}