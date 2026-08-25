import Image from "next/image";

type SlideImage = {
  id: string;
  image: string;
  imagePosition?: string;
  name: string;
};

export default function HeroSlideshow({ images }: { images: SlideImage[] }) {
  const duration = images.length * 4;

  return (
    <div className="relative w-full h-full">
      {/* Blob shape definition — invisible, just holds the clip-path math */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="heroBlob" clipPathUnits="objectBoundingBox">
            <path d="M0.28,0.02 C0.5,-0.02 0.62,0.08 0.7,0.16 C0.85,0.3 1,0.32 1,0.55 C1,0.75 0.95,0.88 0.8,0.96 C0.6,1.05 0.32,1.02 0.15,0.9 C0,0.79 -0.02,0.6 0.05,0.45 C0.12,0.3 0.02,0.18 0.1,0.08 C0.15,0.02 0.2,0.03 0.28,0.02 Z" />
          </clipPath>
        </defs>
      </svg>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: "url(#heroBlob)" }}
      >
        {images.map((img, i) => (
          <div
            key={img.id}
            className="absolute inset-0 hero-slide"
            style={{
              ["--hero-duration" as string]: `${duration}s`,
              animationDelay: `${i * 4}s`,
            }}
          >
            <Image
              src={img.image}
              alt={img.name}
              fill
              priority={i === 0}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: img.imagePosition ?? "center" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}