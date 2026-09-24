"use client";

import { useState } from "react";

interface InstagramVideoCardProps {
  videoUrl: string;
}

export default function InstagramVideoCard({
  videoUrl,
}: InstagramVideoCardProps) {
  const [active, setActive] = useState(false);

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => setActive(true)}
        className="group relative flex aspect-[9/16] w-full items-center justify-center overflow-hidden border border-border bg-muted/20 transition-colors hover:border-accent"
        aria-label="Carregar vídeo do Instagram"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border text-2xl transition-colors group-hover:border-accent group-hover:text-accent">
            ▶
          </span>

          <span className="text-sm text-muted transition-colors group-hover:text-foreground">
            Ver vídeo no Instagram
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="aspect-[9/16] w-full overflow-hidden border border-border">
      <iframe
        src={`${videoUrl.replace(/\/$/, "")}/embed`}
        className="h-full w-full"
        allowFullScreen
        loading="lazy"
        title="Vídeo do Instagram"
      />
    </div>
  );
}