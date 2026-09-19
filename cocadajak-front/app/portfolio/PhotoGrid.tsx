"use client";

import { useState } from "react";
import { Photo } from "@/lib/api";
import { formatMonthYear } from "@/lib/formatDate";

export default function PhotoGrid({
  photos,
  highlightId,
}: {
  photos: Photo[];
  highlightId?: number;
}) {
  const [selected, setSelected] = useState<Photo | null>(
    () => photos.find((p) => p.id === highlightId) ?? null
  );

  return (
    <>
      <div className="mt-10 flex flex-col divide-y divide-border">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelected(photo)}
            className="flex flex-col gap-6 py-10 text-left first:pt-0 sm:flex-row sm:items-center sm:gap-12"
          >
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${photo.thumbnail_path ?? photo.image_path}`}
              alt={photo.title}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-opacity hover:opacity-90 sm:w-2/5"
            />

            <div className="flex flex-1 flex-col gap-3">
              {photo.category && (
                <span className="text-sm text-accent">{photo.category.name}</span>
              )}
              <h2 className="font-display text-2xl italic sm:text-3xl">
                {photo.title}
              </h2>
              {photo.event_date && (
                <span className="text-sm text-muted">
                  {formatMonthYear(photo.event_date)}
                </span>
              )}
              {photo.description && (
                <p className="line-clamp-3 max-w-md break-words text-sm text-muted">
                  {photo.description}
                </p>
              )}
            </div>
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
                <p className="break-words text-sm text-muted">{selected.description}</p>
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