export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  category: 'special' | 'offer' | 'season' | 'tournament' | 'community';
  featured: boolean;
  isRegistered: boolean;
  progress: number;
  participants: number;
  rewards: string[];
  requirements: string[];
}

export interface EventFilters {
  search: string;
  category: string[];
  status: 'all' | 'active' | 'upcoming' | 'past';
  sort: 'name' | 'date' | 'participants' | 'recent';
}

export interface EventClickHandler {
  (event: CalendarEvent): void;
}
