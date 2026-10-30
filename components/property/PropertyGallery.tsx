"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Displays property photos and an interactive full-screen gallery.
 *
 * @param props.images - Image URLs to display.
 * @param props.title - Property title used in image labels.
 */
export default function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const safeImages = images.filter(Boolean);

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => index === null ? null : (index + 1) % safeImages.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => index === null ? null : (index - 1 + safeImages.length) % safeImages.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, safeImages.length]);

  if (safeImages.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-[10px] bg-gray-100 text-sm text-gray-dark">
        Aucune photo disponible
      </div>
    );
  }

  return (
    <>
      <section aria-label={`Photos de ${title}`} className="grid grid-cols-2 gap-2 overflow-hidden rounded-[10px] md:grid-cols-4">
        {safeImages.slice(0, 5).map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Agrandir la photo ${index + 1} sur ${safeImages.length}`}
            className={`relative min-h-32 overflow-hidden bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#99331A] md:min-h-40 ${index === 0 ? "col-span-2 row-span-2 min-h-64 md:min-h-[440px]" : ""} ${index > 2 ? "hidden md:block" : ""}`}
          >
            <Image
              src={image}
              alt={`${title}, photo ${index + 1}`}
              fill
              preload={index === 0}
              sizes={index === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 25vw"}
              className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </button>
        ))}
      </section>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Galerie photos"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null);
          }}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Fermer la galerie"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl text-black"
          >
            ×
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((activeIndex - 1 + safeImages.length) % safeImages.length)}
            aria-label="Photo précédente"
            className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl text-black md:left-8"
          >
            ‹
          </button>
          <div className="relative h-[75vh] w-full max-w-6xl">
            <Image
              src={safeImages[activeIndex]}
              alt={`${title}, photo ${activeIndex + 1} sur ${safeImages.length}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={() => setActiveIndex((activeIndex + 1) % safeImages.length)}
            aria-label="Photo suivante"
            className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl text-black md:right-8"
          >
            ›
          </button>
          <p className="absolute bottom-4 text-sm text-white">
            {activeIndex + 1} / {safeImages.length}
          </p>
        </div>
      )}
    </>
  );
}
