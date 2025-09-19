'use client';

import { StoreBackend } from '@/components/store/store-backend';

/**
 * Store Page Component
 * Main page for the Aqua Stark store using real backend data
 *
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-01-XX
 */
export default function StorePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900'>
      <div className='container mx-auto px-4 py-8'>
        <StoreBackend />
      </div>
    </div>
  );
}
