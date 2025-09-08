export interface CommunityEventFilters {
  search: string;
  status: 'all' | 'active' | 'upcoming' | 'past';
  sort: 'name' | 'participants' | 'recent';
  minParticipants: number;
  maxParticipants: number;
}

export interface CommunityGalleryFilters {
  search: string;
  sort: 'name' | 'owner' | 'likes-high' | 'likes-low' | 'recent';
  minLikes: number;
  maxLikes: number;
  minComments: number;
  maxComments: number;
  key: number;
}
