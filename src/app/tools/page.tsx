'use client'
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ReactNode, SelectHTMLAttributes, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from "sonner"; // ← ajouté

// Composant GradientButton
function GradientButton({ children, onClick, disabled }: { children: ReactNode, onClick?: () => void, disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-lg rounded-full transition-all duration-300 hover:shadow-[0_15px_40px_rgba(255,69,0,0.6)] flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
      <svg
        className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
    </button>
  );
}

// Composant Select simplifié
function Select({ value, onChange }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      <option value="">Choisir un type (image, vidéo, texte…)</option>
      <option value="image">🖼 Image</option>
      <option value="video">🎥 Vidéo</option>
      <option value="text">✏️ Texte</option>
      <option value="article">📰 Article (URL)</option>
    </select>
  );
}

export default function Tools() {
  const { user } = useUser();
  const { handleSubmit } = useForm();
  const router = useRouter();
  const [contentType, setContentType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [textContent, setTextContent] = useState('');
  const [urlContent, setUrlContent] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error("Connexion requise", {
        description: "Vous devez être connecté pour analyser du contenu.",
      });
      return;
    }

    setLoading(true);

    try {
      const email = user.primaryEmailAddress.emailAddress;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      if (contentType === 'video' && file) {
        // Upload vidéo
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(
          `${baseUrl}/api/media/videos/upload?userEmail=a.razafindratelo@gmail.com`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: 'Upload failed' }));
          throw new Error(error.message || 'Erreur lors de l\'upload de la vidéo');
        }
        const data = await response.json();
        console.log('Vidéo uploadée:', data);
        router.push('tools/report/video')

      } else if (contentType === 'image' && file) {
        // Upload image
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(
          `${baseUrl}/api/media/images/upload?userEmail=${encodeURIComponent(email)}`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: 'Upload failed' }));
          throw new Error(error.message || 'Erreur lors de l\'upload de l\'image');
        }
        const data = await response.json();
        console.log('Image uploadée:', data);
        router.push('tools/report/image')

      } else if (contentType === 'text' && textContent) {
        // Upload texte
        const response = await fetch(
          `${baseUrl}/api/media/text/upload?userEmail=${encodeURIComponent(email)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: textContent }),
          }
        );

        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: 'Analysis failed' }));
          throw new Error(error.message || 'Erreur lors de l\'analyse du texte');
        }
        const data = await response.json();
        console.log('Texte analysé:', data);
        router.push('tools/report/text')

      } else if (contentType === 'article' && urlContent) {
        // Upload article (URL)
        const response = await fetch(
          `${baseUrl}/api/media/article/upload?userEmail=${encodeURIComponent(email)}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: urlContent }),
          }
        );

        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: 'Analysis failed' }));
          throw new Error(error.message || 'Erreur lors de l\'analyse de l\'article');
        }
        const data = await response.json();
        console.log('Article analysé:', data);
        router.push('tools/report/article')

      } else {
        toast("Sélection requise", {
          description: "Veuillez sélectionner un contenu à analyser.",
        });
        setLoading(false);
        return;
      }

      // Réinitialiser le formulaire après succès
      setFile(null);
      setPreview(null);
      setTextContent('');
      setUrlContent('');

      toast.success("Analyse terminée 🎉", {
        description: "Votre contenu a été analysé avec succès.",
      });

    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Erreur", {
        description: error instanceof Error ? error.message : "Une erreur est survenue.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = (): void => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
  };

  const renderUploadSection = () => {
    if (contentType === 'image' && preview) {
      return (
        <div className="relative">
          <img
            src={preview}
            alt="Aperçu"
            className="w-full h-auto max-h-96 object-contain rounded-xl"
          />
          <button
            onClick={handleRemoveFile}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      );
    }

    if (contentType === 'video' && preview) {
      return (
        <div className="relative">
          <video
            src={preview}
            controls
            className="w-full h-auto max-h-96 rounded-xl"
          />
          <button
            onClick={handleRemoveFile}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      );
    }

    if (contentType === 'text') {
      return (
        <textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Collez ou saisissez votre texte ici..."
          className="w-full h-48 p-4 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:border-orange-500 transition text-gray-700"
        />
      );
    }

    if (contentType === 'article') {
      return (
        <input
          type="url"
          value={urlContent}
          onChange={(e) => setUrlContent(e.target.value)}
          placeholder="https://exemple.com/article"
          className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 transition text-gray-700"
        />
      );
    }

    if (contentType === 'image' || contentType === 'video') {
      const acceptTypes = contentType === 'image'
        ? 'image/jpeg,image/png,image/jpg,image/webp'
        : 'video/mp4,video/webm,video/quicktime';

      const formatText = contentType === 'image'
        ? '.jpg, .png, .webp'
        : '.mp4, .webm, .mov';

      return (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#FF6A5A] transition">
          <input
            type="file"
            accept={acceptTypes}
            className="hidden"
            id="fileInput"
            onChange={handleFileChange}
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <div className="text-6xl mb-4">
              {contentType === 'image' ? '🖼️' : '🎥'}
            </div>
            <p className="text-lg font-medium text-gray-700">
              Cliquez pour sélectionner {contentType === 'image' ? 'une image' : 'une vidéo'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Formats supportés : {formatText}
            </p>
          </label>
        </div>
      );
    }

    return (
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
        <p className="text-lg font-medium text-gray-500">
          Sélectionnez d'abord un type de contenu
        </p>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center px-6">
      <section className="text-center mt-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Détectez la fiabilité<br />de n'importe quel contenu
        </h1>
        <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">
          Analysez des images, vidéos, textes ou articles pour repérer
          les contenus manipulés ou générés par IA.
        </p>
      </section>

      <section className="mt-12 w-full flex justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-3xl w-full">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
            Analyse intelligente de contenu
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 font-medium">
                Type de contenu à analyser
              </label>
              <Select value={contentType} onChange={(e) => {
                const type = e.target.value;
                if (type === 'image') {
                  router.push('/image-analysis');
                }
                setContentType(type);
              }} />
            </div>

            <div className="mb-8">
              <label className="block mb-2 text-gray-700 font-medium">
                Contenu à analyser
              </label>
              {renderUploadSection()}
            </div>

            <div className="flex justify-center">
              <GradientButton disabled={loading}>
                {loading ? 'Analyse en cours...' : 'Analyser le contenu'}
              </GradientButton>
            </div>
          </form>
        </div>
      </section>

      <section className="flex flex-wrap gap-4 justify-center mt-10">
        <div className="px-6 py-3 bg-white shadow rounded-full text-gray-700 font-medium">
          ✔ 10 000+ contenus analysés
        </div>
        <div className="px-6 py-3 bg-white shadow rounded-full text-gray-700 font-medium">
          ✔ Détection IA avancée
        </div>
        <div className="px-6 py-3 bg-white shadow rounded-full text-gray-700 font-medium">
          ✔ 100% gratuit
        </div>
      </section>

      <footer className="mt-16 py-8 text-gray-500 text-sm text-center border-t w-full">
        UnFaked © 2025
      </footer>
    </main>
  );
}
