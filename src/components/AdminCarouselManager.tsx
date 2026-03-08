import { useState, useEffect } from "react";
import { Trash2, Upload } from "lucide-react";
import api from "../http/api";
import { toast } from "sonner";
import ConfirmModal from "./modal";
import { ENDPOINTS } from "@/endpoints";
import type { CarouselImage } from "@/types/carousel/carousel.types";

export default function AdminCarouselManager() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await api.get(ENDPOINTS.carousel.base);
      setImages(res.data || []);
    } catch (error) {
      toast.error("Erro ao buscar imagens do carousel");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Apenas imagens (JPEG, PNG, WebP, GIF) são permitidas");
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande (máximo 5MB)");
      return;
    }

    setImageFile(file);

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddImage = async () => {
    if (!imageFile) {
      toast.error("Selecione uma imagem");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await api.post(ENDPOINTS.carousel.base, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.image) {
        setImages([...images, res.data.image]);
        setImageFile(null);
        setPreview(null);
        // Reset input
        const input = document.getElementById("imageInput") as HTMLInputElement;
        if (input) input.value = "";
        toast.success("Imagem adicionada com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao adicionar imagem");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: number) => {
    setDeleteId(id);
    setDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;

    try {
      await api.delete(ENDPOINTS.carousel.byId(deleteId));
      setImages(images.filter((img) => img.id !== deleteId));
      toast.success("Imagem removida com sucesso!");
    } catch (error) {
      toast.error("Erro ao remover imagem");
    } finally {
      setDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Carregando imagens...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6">
      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={deleteConfirm}
        message="Deseja remover esta imagem do carousel?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteConfirm(false);
          setDeleteId(null);
        }}
      />

      {/* Formulário de upload */}
      <div className="bg-neutral-800 rounded-[15px] p-4 md:p-6">
        <h2 className="text-lg font-semibold text-[#B8952E] mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" /> Enviar Nova Imagem
        </h2>
        <div className="flex flex-col gap-4">
          {/* Preview */}
          {preview && (
            <div className="relative w-full max-w-sm">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border-2 border-[#B8952E]"
              />
              <button
                onClick={() => {
                  setPreview(null);
                  setImageFile(null);
                }}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors"
              >
                ✕
              </button>
            </div>
          )}

          {/* Input de arquivo */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              Selecionar Imagem
            </label>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#B8952E] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#B8952E] file:text-black file:font-medium hover:file:bg-yellow-500 cursor-pointer"
            />
            <p className="text-xs text-white/50 mt-2">
              Máximo 5MB - Formatos: JPEG, PNG, WebP, GIF
            </p>
          </div>

          {/* Botão de upload */}
          <button
            onClick={handleAddImage}
            disabled={uploading || !imageFile}
            className="flex items-center justify-center gap-2 bg-[#B8952E] hover:bg-yellow-500 disabled:bg-gray-600 text-black font-medium py-3 rounded-lg transition-colors w-full"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Enviando..." : "Enviar Imagem"}
          </button>
        </div>
      </div>

      {/* Lista de imagens */}
      <div className="bg-neutral-800 rounded-[15px] p-4 md:p-6">
        <h2 className="text-lg font-semibold text-[#B8952E] mb-4">
          Imagens do Carousel ({images.length})
        </h2>
        {images.length === 0 ? (
          <p className="text-white/60">Nenhuma imagem no carousel ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="bg-black rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-white/10"
              >
                <img
                  src={img.imageUrl}
                  alt="Imagem do carousel"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23333' width='100' height='100'/%3E%3Ctext x='50' y='50' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3EImagem inválida%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="p-4">
                  <p className="text-xs text-white/50 mb-3 break-all font-mono">
                    {img.filename}
                  </p>
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="w-full flex items-center justify-center gap-2  text-white font-medium py-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
