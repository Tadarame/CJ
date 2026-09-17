"use client";

import { useState } from "react";
import { Photo } from "@/lib/api";
import { formatMonthYear } from "@/lib/formatDate";

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<Photo | null>(null);

  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelected(photo)}
            className="text-left"
          >
            <figure>
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${photo.image_path}`}
                alt={photo.title}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-opacity hover:opacity-90"
              />
              <figcaption className="mt-3">
                <div className="flex items-baseline justify-between text-sm">
                  <span>{photo.title}</span>
                  {photo.category && (
                    <span className="text-muted">{photo.category.name}</span>
                  )}
                </div>
                {photo.description && (
                  <p className="mt-1 text-sm text-muted">{photo.description}</p>
                )}
              </figcaption>
            </figure>
          </button>
        ))}
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="grid max-h-full max-w-4xl gap-6 overflow-y-auto sm:grid-cols-2"
          >
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${selected.image_path}`}
              alt={selected.title}
              className="max-h-[80vh] w-full object-contain"
            />
            <div className="flex flex-col gap-3 py-2">
              <h2 className="font-display text-2xl italic">{selected.title}</h2>
              {selected.category && (
                <span className="text-sm text-muted">{selected.category.name}</span>
              )}
              {selected.event_date && (
                <span className="text-sm text-accent">
                  {formatMonthYear(selected.event_date)}
                </span>
              )}
              {selected.description && (
                <p className="text-sm text-muted">{selected.description}</p>
              )}
              <button
                onClick={() => setSelected(null)}
                className="mt-4 w-fit border border-border px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}