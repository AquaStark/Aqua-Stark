'use client';

import { UnderConstruction } from '@/components/ui/under-construction';
import { PageHeader } from '@/components';
import { User, Award, Fish, TrendingUp } from 'lucide-react';

export default function MyProfilePage() {
  return (
    <UnderConstruction
      pageName='My Profile'
      description="We're designing your personal underwater profile! Soon you'll be able to showcase your collection, achievements, and connect with the community."
    >
      <div className='min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900'>
        <PageHeader title='My Profile' backTo='/game' backText='Back to Game' />

        <div className='container mx-auto px-4 py-8 max-w-4xl'>
          {/* Profile Header */}
          <div className='bg-blue-800/30 border border-blue-600/30 rounded-lg p-6 mb-6'>
            <div className='flex items-center gap-6'>
              <div className='w-24 h-24 bg-blue-700/30 rounded-full'></div>
              <div className='flex-1'>
                <div className='h-6 bg-blue-700/30 rounded w-48 mb-3'></div>
                <div className='h-4 bg-blue-700/30 rounded w-64'></div>
              </div>
              <button className='px-4 py-2 bg-blue-600 text-white rounded-lg'>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6'>
            <div className='bg-blue-800/30 border border-blue-600/30 rounded-lg p-4 text-center'>
              <Fish className='w-6 h-6 text-blue-300 mx-auto mb-2' />
              <div className='h-6 bg-blue-700/30 rounded mb-2'></div>
              <div className='text-sm text-blue-300'>Total Fish</div>
            </div>
            <div className='bg-blue-800/30 border border-blue-600/30 rounded-lg p-4 text-center'>
              <Award className='w-6 h-6 text-yellow-400 mx-auto mb-2' />
              <div className='h-6 bg-blue-700/30 rounded mb-2'></div>
              <div className='text-sm text-blue-300'>Achievements</div>
            </div>
            <div className='bg-blue-800/30 border border-blue-600/30 rounded-lg p-4 text-center'>
              <TrendingUp className='w-6 h-6 text-green-400 mx-auto mb-2' />
              <div className='h-6 bg-blue-700/30 rounded mb-2'></div>
              <div className='text-sm text-blue-300'>Level</div>
            </div>
            <div className='bg-blue-800/30 border border-blue-600/30 rounded-lg p-4 text-center'>
              <User className='w-6 h-6 text-purple-400 mx-auto mb-2' />
              <div className='h-6 bg-blue-700/30 rounded mb-2'></div>
              <div className='text-sm text-blue-300'>Friends</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className='bg-blue-800/30 border border-blue-600/30 rounded-lg p-6'>
            <h3 className='text-xl font-bold text-white mb-4'>
              Recent Activity
            </h3>
            <div className='space-y-3'>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className='flex items-center gap-3 py-2'>
                  <div className='w-10 h-10 bg-blue-700/30 rounded'></div>
                  <div className='flex-1'>
                    <div className='h-4 bg-blue-700/30 rounded mb-2'></div>
                    <div className='h-3 bg-blue-700/30 rounded w-32'></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </UnderConstruction>
  );
}
