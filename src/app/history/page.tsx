"use client";

import { useUser } from "@clerk/nextjs";
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Image as ImageIcon, 
  Video, 
  Type, 
  Link as LinkIcon,
  Calendar,
  ArrowRight,
  Search,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Définition de la structure d'une analyse (à adapter selon votre retour API réel)
interface AnalysisItem {
  id: string;
  type: "image" | "video" | "text" | "article";
  title?: string; // ou summary
  verdict: "safe" | "suspect" | "fake";
  confidence: number;
  createdAt: string;
  thumbnailUrl?: string;
}

const STATUS_CONFIG = {
  safe: {
    label: "Fiable",
    icon: CheckCircle,
    colors: "bg-green-100 text-green-700 border-green-200",
    barColor: "bg-green-500"
  },
  suspect: {
    label: "Suspect",
    icon: AlertCircle,
    colors: "bg-yellow-100 text-yellow-700 border-yellow-200",
    barColor: "bg-yellow-500"
  },
  fake: {
    label: "Deepfake",
    icon: XCircle,
    colors: "bg-red-100 text-red-700 border-red-200",
    barColor: "bg-red-500"
  }
};

const TYPE_ICONS = {
  image: <ImageIcon className="w-5 h-5" />,
  video: <Video className="w-5 h-5" />,
  text: <Type className="w-5 h-5" />,
  article: <LinkIcon className="w-5 h-5" />
};

export default function HistoryPage() {
  const { user, isLoaded } = useUser();
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Récupération des données réelles
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      try {
        // Remplacez '/api/history' par votre endpoint réel
        const response = await fetch(`/api/history?userEmail=${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`);
        
        if (!response.ok) {
            throw new Error("Impossible de charger l'historique");
        }

        const data = await response.json();
        // Assurez-vous que data est un tableau, sinon adaptez (ex: data.items)
        setAnalyses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error("Erreur de chargement", {
            description: "Impossible de récupérer votre historique."
        });
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchHistory();
    } else if (isLoaded && !user) {
        setLoading(false); // Pas d'utilisateur connecté
    }
  }, [user, isLoaded]);

  // Filtrage local
  const filteredHistory = analyses.filter(item => {
    const matchesFilter = filter === "all" || item.verdict === filter;
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.type.includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center px-6 pb-20">
      
      {/* HEADER */}
      <header className="w-full max-w-4xl py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Historique</h1>
            <p className="text-gray-500 mt-1">
              Retrouvez toutes vos analyses précédentes.
            </p>
          </div>
          
          <Link href="/tools">
            <button className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-sm flex items-center gap-2">
              <span>+ Nouvelle analyse</span>
            </button>
          </Link>
        </div>
      </header>

      {/* BARRE D'ACTIONS (Filtres & Recherche) */}
      <section className="w-full max-w-4xl mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Onglets de filtre */}
        <div className="flex p-1 bg-gray-200 rounded-xl overflow-hidden w-full md:w-auto">
          {['all', 'safe', 'suspect', 'fake'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                filter === f 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'all' ? 'Tout' : STATUS_CONFIG[f as keyof typeof STATUS_CONFIG].label}
            </button>
          ))}
        </div>

        {/* Barre de recherche */}
        <div className="relative w-full md:w-64 group">
            <input 
                type="text" 
                placeholder="Rechercher..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 transition-all group-hover:border-gray-300"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>
      </section>

      {/* CONTENU PRINCIPAL */}
      <div className="w-full max-w-4xl space-y-4">
        
        {loading ? (
          /* SKELETON LOADER */
          <div className="space-y-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />
             ))}
          </div>
        ) : filteredHistory.length > 0 ? (
          /* LISTE DES RÉSULTATS */
          filteredHistory.map((item) => {
            const status = STATUS_CONFIG[item.verdict];
            const StatusIcon = status.icon;

            return (
              <Link 
                // Note: Idéalement pointez vers /tools/report/[id] si votre backend le supporte
                // Pour l'instant on garde la logique par type du code fourni
                href={`/tools/report/${item.type}`} 
                key={item.id}
                className="group block bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-orange-200 relative overflow-hidden"
              >
                <div className="flex items-center justify-between gap-4 relative z-10">
                  
                  {/* GAUCHE: ICON & INFO */}
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 text-gray-600 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors shrink-0`}>
                        {TYPE_ICONS[item.type]}
                    </div>
                    
                    <div className="flex flex-col min-w-0">
                      <h3 className="font-bold text-gray-800 truncate pr-4 text-lg group-hover:text-orange-600 transition-colors">
                        {item.title || `Analyse ${item.type}`}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(item.createdAt)}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="capitalize">{item.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* DROITE: VERDICT & SCORE */}
                  <div className="flex items-center gap-6">
                    
                    {/* Badge Verdict */}
                    <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border ${status.colors}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="font-semibold text-sm">{status.label}</span>
                    </div>

                    {/* Score de confiance */}
                    <div className="hidden md:block w-24">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Confiance</span>
                            <span className={item.verdict === 'fake' ? 'text-red-600 font-bold' : ''}>
                                {Math.round(item.confidence)}%
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                style={{ width: `${item.confidence}%` }} 
                                className={`h-full ${status.barColor}`}
                            />
                        </div>
                    </div>

                    {/* Flèche d'action */}
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all transform group-hover:translate-x-1">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                </div>
              </Link>
            );
          })
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 animate-bounce-slow">
                <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Aucune analyse trouvée</h3>
            <p className="text-gray-500 mt-2 mb-6 max-w-sm">
                {searchQuery 
                    ? "Aucun résultat ne correspond à votre recherche." 
                    : "Vous n'avez pas encore effectué d'analyse. Commencez maintenant !"}
            </p>
            <Link href="/tools">
                <button className="text-orange-600 font-medium hover:text-orange-700 hover:underline underline-offset-4">
                    Lancer une analyse &rarr;
                </button>
            </Link>
          </div>
        )}
      </div>

      <footer className="mt-16 py-8 text-gray-400 text-sm text-center">
        UnFaked © 2025 · Vos données sont privées et sécurisées
      </footer>
    </main>
  );
}