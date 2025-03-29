"use client";

import { Button } from "@/components/ui/button";
import { mockEvents } from "@/data/mock-community";
import {
  Filter,
  Calendar,
  Award,
  Clock,
  User,
  Sparkles,
  History
} from "lucide-react";

export default function CommunityEvents() {
  const activeEvent = mockEvents.find((e) => e.status === "active");
  const upcomingEvents = mockEvents.filter((e) => e.status === "upcoming");
  const pastEvents = mockEvents.filter((e) => e.status === "past");

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Community Events</h2>
        <Button
              variant="outline"
              className="bg-blue-800 border-blue-700 text-white hover:bg-blue-700 hover:text-white 
                         transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-blue-900/50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
      </div>

      {/* Active Event */}
      {activeEvent && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-200" />
            Active Events
          </h3>

          <div
            className="
              bg-white/10 rounded p-4 relative
              flex flex-col md:flex-row gap-4
            "
          >
            {/* Etiqueta "Active Now" */}
            <span className="absolute top-2 left-2 bg-green-500 text-white text-sm px-2 py-1 rounded-full font-semibold">
              Active Now
            </span>

            {/* Imagen a la izquierda */}
            <div className="w-full md:w-2/5 h-40 bg-white/10 rounded flex items-center justify-center">
              <p className="text-gray-400">[ Event Image ]</p>
            </div>

            {/* Información a la derecha */}
            <div className="flex-1 flex flex-col justify-between">
              {/* Título y descripción */}
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  {activeEvent.name}
                </h4>
                <p className="text-sm text-gray-300 mb-4">
                  {activeEvent.description}
                </p>

                {/* Date / Participants en columnas */}
                <div className="flex items-start justify-between text-sm text-blue-200 mb-3">
                  {/* Date con su título y valor en línea aparte */}
                  <div>
                    <strong className="text-white block">Date</strong>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{activeEvent.startDate} - {activeEvent.endDate}</span>
                    </div>
                  </div>

                  {/* Participants con su título y valor */}
                  <div className="text-right">
                    <strong className="text-white block">Participants</strong>
                    <div className="flex items-center gap-1 justify-end">
                      <User className="w-4 h-4" />
                      <span>{activeEvent.participants}</span>
                    </div>
                  </div>
                </div>

                {/* Rewards */}
                <div className="text-sm text-blue-200 mb-2">
                  <strong className="text-white block">Rewards</strong>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{activeEvent.rewards}</span>
                  </div>
                </div>
              </div>

              {/* Botón Join a la derecha */}
              <div className="flex justify-end mt-4">
                <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold w-32">
                  Join Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Events (sin cambios) */}
      {upcomingEvents.length > 0 && (
        <div className="space-y-4">
          {/* Título con ícono Calendar */}
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-200" />
            Upcoming Events
          </h3>

    {/* Usamos grid de 2 columnas para que cada evento sea más ancho */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {upcomingEvents.map((event) => (
        <div
          key={event.id}
          className="
            bg-white/10 rounded p-4 relative
            shadow-md shadow-blue-900/40
            transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/70
            flex flex-col
          "
        >
          {/* Etiqueta "Coming Soon" */}
          <span className="absolute top-2 left-2 bg-blue-500 text-white text-sm px-2 py-1 rounded-full font-semibold">
            Coming Soon
          </span>

          {/* Imagen grande arriba */}
          <div className="w-full h-40 bg-white/10 rounded flex items-center justify-center mb-3">
            <p className="text-gray-400">[ Event Image ]</p>
          </div>

          {/* Título */}
          <h4 className="text-white font-semibold text-lg mb-1">
            {event.name}
          </h4>

          {/* Descripción */}
          <p className="text-sm text-gray-300 mb-4">
            {event.description}
          </p>

          {/* Parte de abajo: fecha (a la izquierda) y botón "Remind Me" (derecha) */}
          <div className="flex items-center justify-between mt-auto text-blue-200 text-sm">
            {/* Fecha */}
            <div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {event.startDate} - {event.endDate}
                </span>
              </div>
            </div>

            {/* Botón Remind Me */}
            <Button
  className="
    bg-white/10 text-white 
    hover:bg-white/20 
    transition-colors 
    font-semibold
    px-3 py-1
    rounded
  "
>
  Remind Me
</Button>
          </div>
        </div>
      ))}
    </div>
  </div>
)} 

{pastEvents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-blue-200" />
            Past Events
          </h3>
    {/* Contenedor al 50% del ancho */}
    <div className="max-w-[50%]">
      {pastEvents.slice(0, 1).map((event) => (
        <div
          key={event.id}
          className="relative bg-white/10 rounded p-4 flex flex-col md:flex-row gap-4"
        >
          <span className="absolute top-2 left-2 bg-gray-500 text-white text-sm px-2 py-1 rounded-full font-semibold">
            Ended
          </span>

          <div className="w-full md:w-2/5 h-40 bg-white/10 rounded flex items-center justify-center">
            <p className="text-gray-400">[ Event Image ]</p>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h4 className="text-white font-semibold text-lg mb-2">
              {event.name}
            </h4>
            <div className="flex items-center justify-between text-blue-200 text-sm mb-2">
            {/* Fecha */}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{event.startDate} - {event.endDate}</span>
            </div>

            {/* # participated */}
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{event.participants} participated</span>
            </div>
          </div>
                    </div>
                  </div>
                ))}
              </div>

    {/* Botón en el centro, fuera del contenedor al 50% */}
    <div className="flex justify-center mt-2">
      <button
        className="
          text-blue-200 font-semibold hover:underline
          transition-colors
        "
      >
        View All Past Events &gt;
      </button>
    </div>
  </div>
)}

      <div className="text-center text-sm text-blue-200 mt-6">
        © 2025 Aqua Stark - All rights reserved
      </div>
    </div>
  );
}
