import { useEffect, useState, useRef } from "react";

const images = ["/BemVindo.svg", "/teste2.png", "/testeteste.png"];

export default function MobileCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Cria array com clone do último no início e primeiro no final para loop infinito
  const slides = [images[images.length - 1], ...images, images[0]];
  const [slideIndex, setSlideIndex] = useState(1); // Começa no primeiro real

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setIsTransitioning(true);
    setSlideIndex((prev) => prev + 1);
  };

  const goToPrev = () => {
    setIsTransitioning(true);
    setSlideIndex((prev) => prev - 1);
  };

  // Lida com o loop infinito
  useEffect(() => {
    if (slideIndex === slides.length - 1) {
      // Chegou no clone do primeiro (final)
      setTimeout(() => {
        setIsTransitioning(false);
        setSlideIndex(1);
      }, 300);
    } else if (slideIndex === 0) {
      // Chegou no clone do último (início)
      setTimeout(() => {
        setIsTransitioning(false);
        setSlideIndex(slides.length - 2);
      }, 300);
    }
    // Atualiza o índice real
    const realIndex = slideIndex - 1;
    if (realIndex >= 0 && realIndex < images.length) {
      setCurrentIndex(realIndex);
    }
  }, [slideIndex]);

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
                  src={image}
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
