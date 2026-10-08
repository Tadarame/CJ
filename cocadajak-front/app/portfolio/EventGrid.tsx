"use client";

import { useEffect, useState } from "react";
import { Event } from "@/lib/api";
import { formatMonthYear } from "@/lib/formatDate";

import InstagramVideoCard from "../components/InstagramVideoCard";
import EventCard from "./components/EventCard";

export default function EventGrid({
  events,
  highlightId,
}: {
  events: Event[];
  highlightId?: number;
}) {
  const [selected, setSelected] = useState<Event | null>(
    () => events.find((e) => e.id === highlightId) ?? null,
  );

  const [photoIndex, setPhotoIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(highlightId !== undefined);
  const [photoVisible, setPhotoVisible] = useState(true);

  const galleryImages = selected
    ? [
        ...(selected.guide_image_path
          ? [
              {
                image_path: selected.guide_image_path,
                thumbnail_path: null,
              },
            ]
          : []),
        ...selected.photos,
      ]
    : [];

  const currentPhoto = galleryImages[photoIndex];

  function openEvent(event: Event) {
    setSelected(event);
    setPhotoIndex(0);
    setModalVisible(false);

    requestAnimationFrame(() => {
      setModalVisible(true);
    });
  }

  function closeModal() {
    setModalVisible(false);

    setTimeout(() => {
      setSelected(null);
      setPhotoIndex(0);
    }, 500);
  }

  useEffect(() => {
    if (!selected) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }

      if (event.key === "ArrowRight") {
        nextPhoto();
      }

      if (event.key === "ArrowLeft") {
        prevPhoto();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {

      document.body.style.overflow = "";

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected]);


  function nextPhoto() {
    if (galleryImages.length === 0) return;

    setPhotoVisible(false);

    setTimeout(() => {
      setPhotoIndex((i) => (i + 1) % galleryImages.length);
      setPhotoVisible(true);
    }, 200);
  }

  function prevPhoto() {
    if (galleryImages.length === 0) return;

    setPhotoVisible(false);

    setTimeout(() => {
      setPhotoIndex(
        (i) => (i - 1 + galleryImages.length) % galleryImages.length,
      );
      setPhotoVisible(true);
    }, 200);
  }

  return (
    <>
      <div className="mt-10 flex flex-col divide-y divide-border">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() => openEvent(event)}
          />
        ))}
      </div>

      {selected && currentPhoto && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`grid max-h-full w-full max-w-6xl gap-6 overflow-y-auto transition-all duration-500 sm:grid-cols-2 ${
              modalVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            {/* Galeria */}
            <div className="relative">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${currentPhoto.image_path}`}
                alt={selected.title}
                className={`max-h-[80vh] w-full object-contain transition-opacity duration-200 ${
                  photoVisible ? "opacity-100" : "opacity-0"
                }`}
              />

              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    aria-label="Foto anterior"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-border/60 bg-background/70 text-xl text-foreground backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-accent hover:bg-background hover:text-accent"
                  >
                    ‹
                  </button>

                  <button
                    onClick={nextPhoto}
                    aria-label="Próxima foto"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-border/60 bg-background/70 text-xl text-foreground backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-accent hover:bg-background hover:text-accent"
                  >
                    ›
                  </button>

                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/70 px-2 py-1 text-xs text-muted">
                    {photoIndex + 1} / {galleryImages.length}
                  </span>
                </>
              )}
            </div>

            {/* Informações */}
            <div className="flex flex-col gap-3 py-2">
              <h2 className="font-display text-2xl italic">{selected.title}</h2>

              {selected.category && (
                <span className="text-sm text-muted">
                  {selected.category.name}
                </span>
              )}

              {selected.event_date && (
                <span className="text-sm text-accent">
                  {formatMonthYear(selected.event_date)}
                </span>
              )}

              {selected.description && (
                <p className="break-words text-sm text-muted">
                  {selected.description}
                </p>
              )}

              {/* Vídeos */}
              {selected.videos.length > 0 && (
                <div className="mt-6 flex flex-col gap-4">
                  <h3 className="text-sm text-accent">Vídeos</h3>

                  <div className="grid gap-4 sm:grid-cols-1">
                    {selected.videos.map((video) => (
                      <InstagramVideoCard
                        key={video.id}
                        videoUrl={`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${video.video_path}`}
                      />
                    ))}
                  </div>
                </div>
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
