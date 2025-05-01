"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Eye, MessageSquare } from "lucide-react";
import { popularCategories, recentDiscussions } from "@/data/mock-community";

export default function CommunityForum() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const filteredDiscussions = recentDiscussions.filter((topic) => {
    if (
      !(
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ) {
      return false;
    }
    if (!category) return true;
    if (!(category && category === topic.category)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Barra superior */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Discussion Forum</h2>

        {/* Buscador + New Topic a la derecha */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search topics..."
              className="pl-10 bg-blue-800 border-blue-700 text-white placeholder:text-blue-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            New Topic
          </Button>
        </div>
      </div>

      {/* Contenedor para Popular Categories */}
      <div className="p-4 bg-white/10 rounded">
        {/* Encabezado con título y botón "View All" */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Popular Categories</h3>
          <Button
            className="bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
            onClick={() => setCategory("")}
          >
            View All
          </Button>
        </div>

        {/* Categorías ocupando todo el ancho en 6 columnas */}
        {/*
          Si tienes exactamente 6 categorías, "grid-cols-6" está bien.
          Si tu número de categorías varía, puedes usar:
            grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6
          o un enfoque dinámico:
            grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))]
        */}
        <div className="grid grid-cols-6 gap-3">
          {popularCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              value={cat}
              className="
                w-full
                bg-white/10 text-white px-4 py-2 rounded
                transition-colors hover:bg-white/20
                text-center font-semibold
              "
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Contenedor para Recent Discussions */}
      <div className="p-4 bg-white/10 rounded">
        <h3 className="text-lg font-bold mb-4">Recent Discussions</h3>

        <div className="space-y-2">
          {filteredDiscussions.map((disc) => (
            <div
              key={disc.id}
              className="
                flex items-start gap-4 p-3 rounded
                transition-colors duration-200
                hover:bg-white/20
                cursor-pointer
              "
            >
              {/* Avatar (placeholder) */}
              <div className="w-12 h-12 bg-white rounded-full flex-shrink-0">
                <img
                  src={disc.imageUrl}
                  alt={disc.author}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              {/* Bloque de texto */}
              <div className="flex-1 space-y-1">
                {/* Título con Sparkles */}
                <div className="flex items-center gap-1 text-white font-semibold">
                  <Sparkles className="w-4 h-4" />
                  {disc.title}
                </div>

                {/* Autor y categoría */}
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="text-white">{disc.author}</span>
                  <span className="text-blue-200">{disc.category}</span>
                </div>

                {/* Replies y Views con íconos */}
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {disc.replies} replies
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {disc.views} views
                  </span>
                </div>
              </div>

              {/* Timestamp a la derecha */}
              <div className="text-sm text-blue-300 flex-shrink-0">
                {disc.timestamp}
              </div>
            </div>
          ))}
        </div>

        {/* "View All Topics" como enlace subrayado al hover */}
        <div className="text-center mt-4">
          <a
            href="#"
            className="
              inline-block text-blue-300 
              hover:underline 
              transition-all 
              font-semibold
            "
          >
            View All Topics &gt;
          </a>
        </div>
      </div>
    </div>
  );
}
