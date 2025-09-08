import { useEffect, useRef, useState } from 'react';
import { mockEvents } from '@/data/event-calendar-data';
import { CalendarEvent } from '@/types/events';

export type TabType = 'all' | 'special' | 'seasons' | 'tournaments' | 'offers';
export type ViewType = 'list' | 'calendar';

export function useEventsCalendar() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [viewType, setViewType] = useState<ViewType>('list');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const filteredEvents = mockEvents
    ? activeTab === 'all'
      ? mockEvents
      : mockEvents.filter(event => event.category === activeTab)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    activeTab,
    viewType,
    selectedEvent,
    searchQuery,
    mobileMenuOpen,
    menuRef,
    filteredEvents,
    setActiveTab: handleTabChange,
    setViewType,
    setSearchQuery,
    handleEventClick,
    closeModal,
    setMobileMenuOpen,
  };
}
