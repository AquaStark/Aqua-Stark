"use client";

import { BubblesBackground } from "@/components/bubble-background";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/layout/page-header";
import { useBubbles } from "@/hooks/use-bubbles";
import EventTabs from "@/components/events-calendar/event-tabs";

export default function EventsCalendarPage() {
  const bubbles = useBubbles();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900 animated-background">
      <BubblesBackground bubbles={bubbles} />

      <PageHeader
        title="Events Calendar"
        backTo="/game"
        backText="Back to Game"
      />

      <main className="relative z-20 flex flex-col items-center px-4 py-8 mx-auto max-w-7xl">
        <EventTabs />
      </main>

      <Footer />
    </div>
  );
}
