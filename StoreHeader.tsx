import { useState, useRef } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  alt?: string;
  label?: string;
}

interface ProductMediaGalleryProps {
  images: Array<{ url: string; alt: string }>;
  videos: Array<{ url: string; label: string }>;
}

export const ProductMediaGallery = ({ images, videos }: ProductMediaGalleryProps) => {
  const allMedia: MediaItem[] = [
    ...images.map(img => ({ type: 'image' as const, url: img.url, alt: img.alt })),
    ...videos.map(vid => ({ type: 'video' as const, url: vid.url, label: vid.label })),
  ];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const selected = allMedia[selectedIdx];

  const goTo = (idx: number) => {
    if (idx >= 0 && idx < allMedia.length) setSelectedIdx(idx);
  };

  if (allMedia.length === 0) {
    return (
      <div className="aspect-square bg-card flex items-center justify-center">
        <p className="text-muted-foreground font-body text-sm">No media available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main display */}
      <div className="relative aspect-square bg-card overflow-hidden group">
        {selected?.type === 'image' ? (
          <img
            src={selected.url}
            alt={selected.alt || ''}
            className="w-full h-full object-contain"
          />
        ) : selected?.type === 'video' ? (
          <video
            ref={videoRef}
            src={selected.url}
            controls
            className="w-full h-full object-contain bg-black"
            preload="metadata"
          />
        ) : null}

        {/* Nav arrows */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={() => goTo(selectedIdx - 1)}
              disabled={selectedIdx === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => goTo(selectedIdx + 1)}
              disabled={selectedIdx === allMedia.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Counter */}
        {allMedia.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm text-xs font-body px-2 py-1">
            {selectedIdx + 1} / {allMedia.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {allMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allMedia.map((item, i) => (
            <button
              key={i}
              onClick={() => setSelectedIdx(i)}
              className={`relative w-16 h-16 flex-shrink-0 overflow-hidden border-2 transition-all ${
                i === selectedIdx
                  ? 'border-accent ring-1 ring-accent/30'
                  : 'border-transparent hover:border-muted-foreground/30'
              }`}
            >
              {item.type === 'image' ? (
                <img src={item.url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Play className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              {item.type === 'video' && item.label && (
                <span className="absolute bottom-0 inset-x-0 bg-foreground/70 text-background text-[9px] text-center font-body leading-tight py-0.5">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
