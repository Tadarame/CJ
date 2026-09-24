"use client";

import { useState } from "react";
import { Event } from "@/lib/api";
import { formatMonthYear } from "@/lib/formatDate";

export default function EventGrid({
  events,
  highlightId,
}: {
  events: Event[];
  highlightId?: number;
}) {
  const [selected, setSelected] = useState<Event | null>(
    () => events.find((e) => e.id === highlightId) ?? null
  );
  const [photoIndex, setPhotoIndex] = useState(0);

  function openEvent(event: Event) {
    setSelected(event);
    setPhotoIndex(0);
  }

  function closeModal() {
    setSelected(null);
    setPhotoIndex(0);
  }

  function nextPhoto() {
    if (!selected) return;
    setPhotoIndex((i) => (i + 1) % selected.photos.length);
  }

  function prevPhoto() {
    if (!selected) return;
    setPhotoIndex((i) => (i - 1 + selected.photos.length) % selected.photos.length);
  }

  const currentPhoto = selected?.photos[photoIndex];

  return (
    <>
      <div className="mt-10 flex flex-col divide-y divide-border">
        {events.map((event) => {
          const cover = event.photos[0];
          return (
            <button
              key={event.id}
              onClick={() => openEvent(event)}
              className="flex flex-col gap-6 py-10 text-left first:pt-0 sm:flex-row sm:items-center sm:gap-12"
            >
              {cover && (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${cover.thumbnail_path ?? cover.image_path}`}
                  alt={event.title}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition-opacity hover:opacity-90 sm:w-2/5"
                />
              )}

              <div className="flex flex-1 flex-col gap-3">
                {event.category && (
                  <span className="text-sm text-accent">{event.category.name}</span>
                )}
                <h2 className="font-display text-2xl italic sm:text-3xl">{event.title}</h2>
                {event.event_date && (
                  <span className="text-sm text-muted">{formatMonthYear(event.event_date)}</span>
                )}
                {event.description && (
                  <p className="line-clamp-3 max-w-md break-words text-sm text-muted">
                    {event.description}
                  </p>
                )}
                {event.photos.length > 1 && (
                  <span className="text-xs text-muted">{event.photos.length} fotos</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selected && currentPhoto && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="grid max-h-full max-w-4xl gap-6 overflow-y-auto sm:grid-cols-2"
          >
            <div className="relative">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${currentPhoto.image_path}`}
                alt={selected.title}
                className="max-h-[80vh] w-full object-contain"
              />

              {selected.photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    aria-label="Foto anterior"
                    className="absolute left-2 top-1/2 -translate-y-1/2 border border-border/60 bg-background/70 px-3 py-2 text-lg transition-colors hover:border-accent hover:text-accent"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextPhoto}
                    aria-label="Próxima foto"
                    className="absolute right-2 top-1/2 -translate-y-1/2 border border-border/60 bg-background/70 px-3 py-2 text-lg transition-colors hover:border-accent hover:text-accent"
                  >
                    ›
                  </button>
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/70 px-2 py-1 text-xs text-muted">
                    {photoIndex + 1} / {selected.photos.length}
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-col gap-3 py-2">
              <h2 className="font-display text-2xl italic">{selected.title}</h2>
              {selected.category && (
                <span className="text-sm text-muted">{selected.category.name}</span>
              )}
              {selected.event_date && (
                <span className="text-sm text-accent">{formatMonthYear(selected.event_date)}</span>
              )}
              {selected.description && (
                <p className="break-words text-sm text-muted">{selected.description}</p>
              )}
              <button
                onClick={closeModal}
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