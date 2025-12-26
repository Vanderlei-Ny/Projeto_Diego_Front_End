import { useEffect, useState } from "react";

const images = ["/BemVindo.svg", "/teste2.png", "/testeteste.png"];

export default function ImageCarousel() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    const interval = setInterval(next, 5000); // Troca a imagem a cada 5z segundos
    return () => clearInterval(interval); // Limpa o intervalo quando o componente desmontar
  }, [index]);

  return (
    <div className="relative w-[300px] h-[300px] overflow-hidden rounded-xl ">
      <img
        src={images[index]}
        alt="Slide"
        className="w-full h-full object-cover transition duration-500"
      />
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-black text-3xl"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-black text-3xl"
      >
        ›
      </button>
    </div>
  );
}
