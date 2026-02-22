import { ChevronLeft, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminCarouselManager from "../../components/AdminCarouselManager";

export default function CarouselPage() {
  const navigate = useNavigate();

  return (
    <div className="flex w-full min-h-screen px-2 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8 bg-black flex-col">
      <div className="flex w-full max-w-6xl mx-auto flex-col gap-4 sm:gap-6">
        {/* Header */}
        <div className="flex w-full items-center justify-between bg-neutral-800 rounded-[15px] p-4 md:p-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#B8952E] flex items-center gap-2">
              <Image className="w-6 h-6" />
              Gerenciar Carousel
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Adicione, edite ou remova imagens do carousel da barbearia
            </p>
          </div>
          <button
            onClick={() => navigate("/admin")}
            className="p-2 hover:bg-neutral-700 rounded-md transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Conteúdo */}
        <AdminCarouselManager />
      </div>
    </div>
  );
}
