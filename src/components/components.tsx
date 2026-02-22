import { useEffect, useState } from "react";
import api from "../http/api";

interface CarouselImage {
  id: number;
  filename: string;
  imageUrl: string;
  order: number;
}

export default function ImageCarousel() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await api.get("/carousel");
      const carouselImages = res.data || [];
      const sorted = carouselImages.sort(
        (a: CarouselImage, b: CarouselImage) => a.order - b.order
      );
      setImages(sorted);
    } catch (error) {
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (images.length === 0) return;
    setIndex((i) => (i + 1) % images.length);
  };

  const prev = () => {
    if (images.length === 0) return;
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (loading) {
    return (
      <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] overflow-hidden rounded-xl bg-neutral-700 flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] overflow-hidden rounded-xl bg-neutral-700 flex items-center justify-center">
        <p className="text-gray-400 text-center px-4">
          Nenhuma imagem no carousel
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] overflow-hidden rounded-xl">
      <img
        src={images[index].imageUrl}
        alt={`Slide ${index}`}
        className="w-full h-full object-cover transition duration-500"
      />
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-black text-3xl hover:text-gray-700 transition-colors"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-black text-3xl hover:text-gray-700 transition-colors"
      >
        ›
      </button>
    </div>
  );
}
