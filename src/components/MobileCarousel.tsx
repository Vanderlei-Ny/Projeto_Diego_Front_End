import { useEffect, useState, useRef } from "react";
import api from "../http/api";
import { ENDPOINTS } from "@/endpoints";

interface CarouselImage {
  id: number;
  filename: string;
  imageUrl: string;
  order: number;
}

export default function MobileCarousel() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await api.get(ENDPOINTS.carousel.base);
      const carouselImages = res.data || [];
      setImages(
        carouselImages.sort(
          (a: CarouselImage, b: CarouselImage) => a.order - b.order,
        ),
      );
    } catch (error) {
      setImages([]);
    }
  };

  // Cria array com clone do último no início e primeiro no final para loop infinito
  const slides =
    images.length > 0 ? [images[images.length - 1], ...images, images[0]] : [];

  const [slideIndex, setSlideIndex] = useState(images.length > 0 ? 1 : 0);

  // Auto-play
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToNext = () => {
    if (slides.length === 0) return;
    setIsTransitioning(true);
    setSlideIndex((prev) => prev + 1);
  };

  const goToPrev = () => {
    if (slides.length === 0) return;
    setIsTransitioning(true);
    setSlideIndex((prev) => prev - 1);
  };

  // Lida com o loop infinito
  useEffect(() => {
    if (slides.length === 0) return;

    if (slideIndex === slides.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setSlideIndex(1);
      }, 300);
    } else if (slideIndex === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setSlideIndex(slides.length - 2);
      }, 300);
    }
  }, [slideIndex, slides.length]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const diff = touchStartX.current - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  if (slides.length === 0) {
    return (
      <div className="w-full py-4 bg-neutral-700 rounded-xl flex items-center justify-center h-64">
        <p className="text-gray-400">Nenhuma imagem no carousel</p>
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-hidden py-4 cursor-grab active:cursor-grabbing"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div
        className={`flex items-center ${
          isTransitioning ? "transition-transform duration-300 ease-out" : ""
        }`}
        style={{
          transform: `translateX(calc(${-slideIndex * 60}% + 20%))`,
        }}
      >
        {slides.map((image, index) => {
          const isActive = index === slideIndex;

          return (
            <div
              key={index}
              className="flex-shrink-0 px-2"
              style={{ width: "60%" }}
            >
              <div
                className={`aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                  isActive
                    ? "scale-100 opacity-100 shadow-xl"
                    : "scale-[0.85] opacity-40"
                }`}
              >
                <img
                  src={image.imageUrl}
                  alt={`Slide ${index}`}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  draggable={false}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
