'use client';

import { useEffect, useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  CalendarRange,
  ListFilter,
  Search,
  Sparkles,
  Tag,
  Trophy,
  ChevronDown,
} from 'lucide-react';
import { AllEventsView } from './all-events-view';
import { SpecialEventsView } from './special-events-view';
import { ListEventView } from './list-event-view';
import { CalendarView } from './calendar-view';
import { EventDetailsModal } from './event-details-modal';
import { mockEvents } from '@/data/event-calendar-data';
import { CalendarEvent } from '@/types';

type TabType = 'all' | 'special' | 'seasons' | 'tournaments' | 'offers';
type ViewType = 'list' | 'calendar';

export default function EventTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [viewType, setViewType] = useState<ViewType>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const tabs: { id: TabType; label: string; icon: JSX.Element }[] = [
    { id: 'all', label: 'All Events', icon: <Calendar className='w-4 h-4' /> },
    { id: 'special', label: 'Special', icon: <Sparkles className='w-4 h-4' /> },
    {
      id: 'seasons',
      label: 'Seasons',
      icon: <CalendarRange className='w-4 h-4' />,
    },
    {
      id: 'tournaments',
      label: 'Tournaments',
      icon: <Trophy className='w-4 h-4' />,
    },
    { id: 'offers', label: 'Offers', icon: <Tag className='w-4 h-4' /> },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Type guard function to validate CalendarEvent
  const isCalendarEvent = (event: any): event is CalendarEvent => {
    return (
      typeof event === 'object' &&
      event !== null &&
      typeof event.id === 'number' &&
      typeof event.title === 'string' &&
      typeof event.category === 'string'
    );
  };

  const filteredEvents: CalendarEvent[] = (
    activeTab === 'all'
      ? mockEvents
      : mockEvents.filter(e => e.category === activeTab)
  ).filter(isCalendarEvent);

  const handleEventClick = (event: CalendarEvent) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);

  return (
    <div className='w-full'>
      {/* Desktop Tabs */}
      <div className='hidden md:block mb-4'>
        <Tabs
          value={activeTab}
          onValueChange={val => setActiveTab(val as TabType)}
        >
          <TabsList className='flex w-full gap-2 bg-blue-700 rounded-lg p-1'>
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className='flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium'
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile Dropdown */}
      <div className='md:hidden mb-4 relative z-10' ref={menuRef}>
        <button
          className='w-full bg-blue-700 rounded-lg p-3 flex items-center justify-between'
          onClick={() => setMobileOpen(!mobileOpen)}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setMobileOpen(false);
            }
          }}
          aria-expanded={mobileOpen}
          aria-haspopup='true'
          aria-controls='mobile-menu'
        >
          <div className='flex items-center gap-2'>
            {tabs.find(t => t.id === activeTab)?.icon}
            <span className='font-medium'>
              {tabs.find(t => t.id === activeTab)?.label}
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
            aria-hidden='true'
          />
        </button>

        {mobileOpen && (
          <div className='absolute top-full left-0 right-0 mt-1 bg-blue-800 rounded-lg shadow-lg overflow-hidden z-50'>
            <div className='p-1'>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-left rounded-md ${
                    activeTab === tab.id ? 'bg-blue-600' : 'hover:bg-blue-700'
                  }`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileOpen(false);
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search + View Switch */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
        <div className='relative w-full max-w-3xl'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 w-4 h-4' />
          <Input
            type='text'
            placeholder='Search events...'
            className='pl-10 bg-blue-800 border-blue-700 text-white placeholder:text-blue-300'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setViewType('list')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              viewType === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-800/50 text-blue-200'
            }`}
            aria-pressed={viewType === 'list'}
            aria-label='Show list view'
          >
            <ListFilter className='w-4 h-4 inline mr-2' aria-hidden='true' />
            List
          </button>
          <button
            onClick={() => setViewType('calendar')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              viewType === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-800/50 text-blue-200'
            }`}
            aria-pressed={viewType === 'calendar'}
            aria-label='Show calendar view'
          >
            <Calendar className='w-4 h-4 inline mr-2' aria-hidden='true' />
            Calendar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className='w-full'>
        {viewType === 'list' && (
          <>
            {activeTab === 'all' ? (
              <AllEventsView
                events={filteredEvents}
                onEventClick={handleEventClick}
                searchQuery={searchQuery}
              />
            ) : activeTab === 'special' ? (
              <SpecialEventsView
                events={filteredEvents}
                onEventClick={handleEventClick}
                searchQuery={searchQuery}
              />
            ) : (
              <ListEventView
                events={filteredEvents}
                onEventClick={handleEventClick}
                searchQuery={searchQuery}
              />
            )}
          </>
        )}

        {viewType === 'calendar' && (
          <CalendarView
            events={filteredEvents}
            onEventClick={handleEventClick}
          />
        )}

        {(activeTab === 'seasons' ||
          activeTab === 'tournaments' ||
          activeTab === 'offers') &&
          filteredEvents.length === 0 && (
            <div className='flex items-center justify-center h-64 bg-blue-800/30 rounded-lg mt-8 w-full'>
              <p className='text-lg text-blue-200'>
                This tab is under development
              </p>
            </div>
          )}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <EventDetailsModal event={selectedEvent} onClose={closeModal} />
      )}
    </div>
  );
}
