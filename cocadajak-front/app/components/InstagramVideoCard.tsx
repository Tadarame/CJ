"use client";

interface VideoCardProps {
  videoUrl: string;
}

export default function VideoCard({ videoUrl }: VideoCardProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
        <video
            src={videoUrl}
            controls
            playsInline
            preload="metadata"
            className="max-h-full max-w-full object-contain"
        >
            Seu navegador não suporta reprodução de vídeo.
        </video>
    </div>
  );
}