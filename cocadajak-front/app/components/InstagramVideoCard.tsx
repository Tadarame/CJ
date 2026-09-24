"use client";

interface VideoCardProps {
  videoUrl: string;
}

export default function VideoCard({ videoUrl }: VideoCardProps) {
  return (
    <div className="aspect-[9/16] w-full overflow-hidden border border-border bg-black">
      <video
        src={videoUrl}
        controls
        playsInline
        preload="metadata"
        className="h-full w-full object-contain"
      >
        Seu navegador não suporta reprodução de vídeo.
      </video>
    </div>
  );
}