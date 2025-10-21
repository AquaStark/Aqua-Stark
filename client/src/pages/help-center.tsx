'use client';

import { UnderConstruction } from '@/components/ui/under-construction';
import { PageHeader } from '@/components';
import { HelpCircle, Book, MessageCircle, FileText } from 'lucide-react';

export default function HelpCenterPage() {
  return (
    <UnderConstruction 
      pageName="Help Center"
      description="We're building a comprehensive underwater support center! Soon you'll find guides, tutorials, and get help with any questions about your aquarium."
    >
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
        <PageHeader title="Help Center" showBackButton={true} backButtonText="Back to Game" />
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
              <input
                type="text"
                placeholder="What do you need help with?"
                className="w-full pl-12 pr-4 py-3 bg-blue-800/50 border border-blue-600/30 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Help Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-6 hover:border-blue-500/50 transition-colors cursor-pointer">
              <Book className="w-8 h-8 text-blue-300 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Getting Started</h3>
              <p className="text-blue-200 text-sm">Learn the basics of managing your aquarium</p>
            </div>
            <div className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-6 hover:border-blue-500/50 transition-colors cursor-pointer">
              <FileText className="w-8 h-8 text-blue-300 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Guides & Tutorials</h3>
              <p className="text-blue-200 text-sm">Step-by-step instructions for all features</p>
            </div>
            <div className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-6 hover:border-blue-500/50 transition-colors cursor-pointer">
              <MessageCircle className="w-8 h-8 text-blue-300 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Contact Support</h3>
              <p className="text-blue-200 text-sm">Get help from our support team</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border-b border-blue-700/30 pb-4 last:border-0">
                  <div className="h-5 bg-blue-700/30 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-blue-700/30 rounded w-full mb-1"></div>
                  <div className="h-4 bg-blue-700/30 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </UnderConstruction>
  );
}