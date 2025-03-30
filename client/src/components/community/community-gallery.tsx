import { mockAquariums } from '@/data/mock-community';
import { Filter, Sparkles, ThumbsUp, MessageSquare, ShareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";


function CommunityGallery() {
    const featured = mockAquariums.find((aq) => aq.featured);
    const others = mockAquariums.filter((aq) => !aq.featured);
  
    return (
      <div>
        {/* Encabezado de la sección */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Community Aquariums</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-blue-800 border-blue-700 text-white hover:bg-blue-700 hover:text-white 
                         transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-blue-900/50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 font-semibold">
              <Sparkles className="h-4 w-4" />
              Share Mine
            </button>
          </div>
        </div>
  
        
        {featured && (
        <div className="mb-6 bg-white/10 rounded overflow-hidden">
          <div className="relative w-full h-60 overflow-hidden">
            <img
              src={featured.imageUrl}
              alt={featured.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              Featured
            </span>
          </div>

          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{featured.name}</h3>
            <div className="flex items-center justify-between text-sm text-gray-300">
              <p>
                By <span className="text-white font-semibold">{featured.owner}</span> • {featured.timePosted}
              </p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  {featured.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {featured.comments}
                </span>
                <button className="flex items-center gap-1 hover:text-white">
                  <ShareIcon className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de acuarios (con hover animado) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {others.map((aq) => (
          <div
            key={aq.id}
            className="
              p-4 bg-white/10 rounded overflow-hidden relative
              transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/70
              cursor-pointer shadow-md shadow-blue-900/40
            "
          >
            {/* Imagen Bg2.svg */}
            <img
              src={aq.imageUrl}
              alt={aq.name}
              className="w-full h-auto rounded"
            />
            <h4 className="text-lg font-semibold mt-2">{aq.name}</h4>

            {/* Sección inferior: Owner, Likes, Comments */}
            <div className="flex items-center justify-between text-sm text-gray-300 mt-2">
              <p>By {aq.owner}</p>
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  {aq.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {aq.comments}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón Load More */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <button
          className="
            w-full
            bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded
            font-semibold transition-colors
          "
        >
          Load More
        </button>

        {/* Texto de derechos (sin usar <footer>) */}
        <div className="text-center text-sm text-blue-200 mt-4">
          © 2025 Aqua Stark - All rights reserved
        </div>
      </div>
    </div>
  );
}

export default CommunityGallery;