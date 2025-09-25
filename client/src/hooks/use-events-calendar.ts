import { useEffect, useRef, useState } from 'react';
import { mockEvents } from '@/data/event-calendar-data';
import { CalendarEvent } from '@/types';

/**
 * @typedef {'all' | 'special' | 'seasons' | 'tournaments' | 'offers'} TabType
 * @description Represents the type of a calendar tab used for filtering events.
 */
export type TabType = 'all' | 'special' | 'seasons' | 'tournaments' | 'offers';

/**
 * @typedef {'list' | 'calendar'} ViewType
 * @description Represents the display format for the events.
 */
export type ViewType = 'list' | 'calendar';

/**
 * @function useEventsCalendar
 * @description
 * Custom hook to manage the state and logic for an events calendar.
 * It provides functionalities for filtering, viewing, and selecting events,
 * as well as managing UI state like mobile menus.
 *
 * @returns {{
 * activeTab: TabType,
 * viewType: ViewType,
 * selectedEvent: CalendarEvent | null,
 * searchQuery: string,
 * mobileMenuOpen: boolean,
 * menuRef: React.RefObject<HTMLDivElement>,
 * filteredEvents: CalendarEvent[],
 * setActiveTab: (tab: TabType) => void,
 * setViewType: (view: ViewType) => void,
 * setSearchQuery: (query: string) => void,
 * handleEventClick: (event: CalendarEvent) => void,
 * closeModal: () => void,
 * setMobileMenuOpen: (open: boolean) => void,
 * }} An object containing the calendar's state and functions to interact with it.
 */
export function useEventsCalendar() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [viewType, setViewType] = useState<ViewType>('list');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  /**
   * @function handleEventClick
   * @description
   * Sets the currently selected event to display its details.
   *
   * @param {CalendarEvent} event - The event to be selected.
   */
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  /**
   * @function closeModal
   * @description
   * Clears the selected event, effectively closing the event details modal.
   */
  const closeModal = () => {
    setSelectedEvent(null);
  };

  /**
   * @function handleTabChange
   * @description
   * Updates the active tab and closes the mobile menu.
   *
   * @param {TabType} tab - The new tab to set as active.
   */
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  /**
   * @function filteredEvents
   * @description
   * Filters the mock events based on the currently active tab. If the active tab
   * is 'all', all events are returned. Otherwise, events are filtered by category.
   *
   * @returns {CalendarEvent[]} An array of events that match the active tab's filter.
   */
  const filteredEvents = mockEvents
    ? activeTab === 'all'
      ? mockEvents
      : mockEvents.filter(event => event.category === activeTab)
    : [];

  /**
   * @function useEffect
   * @description
   * Handles clicks outside the mobile menu to automatically close it. It adds
   * a `mousedown` event listener to the document and cleans it up on unmount.
   */
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
