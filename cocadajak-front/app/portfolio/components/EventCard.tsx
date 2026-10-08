"use client";

import { Event } from "@/lib/api";
import { formatMonthYear } from "@/lib/formatDate";

export default function EventCard({
  event,
  onClick,
}: {
  event: Event;
  onClick: () => void;
}) {
  const cover = event.photos[0];

  const coverSrc = event.guide_image_path
    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${event.guide_image_path}`
    : cover
      ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${
          cover.thumbnail_path ?? cover.image_path
        }`
      : null;

  return (
    <button
      onClick={onClick}
      className="group flex flex-col gap-6 py-10 text-left first:pt-0 sm:flex-row sm:items-center sm:gap-12"
    >
      {coverSrc && (
        <img
          src={coverSrc}
          alt={event.title}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 hover:scale-[1.02] sm:w-2/5"
        />
      )}

      <div className="flex flex-1 flex-col gap-3 transition-transform duration-500 group-hover:-translate-y-1">
        {event.category && (
          <span className="text-sm text-accent">{event.category.name}</span>
        )}

        <h2 className="font-display text-2xl italic sm:text-3xl">
          {event.title}
        </h2>

        {event.event_date && (
          <span className="text-sm text-muted">
            {formatMonthYear(event.event_date)}
          </span>
        )}

        {event.description && (
          <p className="line-clamp-3 max-w-md break-words text-sm text-muted">
            {event.description}
          </p>
        )}

        {event.photos.length > 1 && (
          <span className="text-xs text-muted">
            {event.photos.length} fotos
          </span>
        )}
      </div>
    </button>
  );
}
