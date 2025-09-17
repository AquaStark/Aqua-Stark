'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMarketStore } from '@/store/market-store';
import { RarityBadge } from '@/components/market/rarity-badge';
import { mockFishData } from '@/data/market-data';
import { useModal } from '@/hooks';

export function OfferModal() {
  const { selectedFish, showOfferModal, setShowOfferModal } = useMarketStore();
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null);

  // Use the unified modal hook
  const { open, close, isOpen } = useModal({
    closable: true,
    onOpen: data => {
      // Handle modal opening
      console.log('Offer modal opened with data:', data);
    },
    onClose: () => {
      // Handle modal closing
      setShowOfferModal(false);
      setSelectedOffer(null);
    },
  });

  // Sync with store state
  useEffect(() => {
    if (showOfferModal && !isOpen) {
      open(selectedFish);
    } else if (!showOfferModal && isOpen) {
      close();
    }
  }, [showOfferModal, isOpen, open, close, selectedFish]);

  if (!selectedFish || !selectedFish.exchange) return null;

  // Filter user's fish that could be offered
  const myFish = mockFishData.slice(0, 3); // TODO: Replace with actual user fish data

  const handleSubmit = () => {
    if (selectedOffer === null) {
      alert('Please select a fish to offer');
      return;
    }

    // TODO: Implement actual offer submission
    alert(`Offer sent for ${selectedFish.name}!`);
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent
        className='bg-blue-900/95 border-blue-700 text-white max-w-md'
        role='dialog'
        aria-labelledby='offer-title'
        aria-describedby='offer-description'
      >
        <DialogHeader>
          <DialogTitle
            id='offer-title'
            className='text-xl font-bold text-center'
          >
            Make an Offer
          </DialogTitle>
        </DialogHeader>

        <div className='flex items-center space-x-4 mb-4'>
          <div
            className='w-16 h-16 bg-blue-800/50 rounded-lg overflow-hidden flex items-center justify-center'
            role='img'
            aria-label={`Preview of ${selectedFish.name}`}
          >
            <img
              src={selectedFish.image || '/placeholder.svg?height=50&width=50'}
              alt=''
              className='w-12 h-12 object-contain'
            />
          </div>
          <div>
            <h3 className='font-bold'>{selectedFish.name}</h3>
            <div className='flex items-center space-x-2 mt-1'>
              <RarityBadge rarity={selectedFish.rarity} />
              <span className='text-xs text-blue-300'>
                Level {selectedFish.level}
              </span>
            </div>
          </div>
        </div>

        <div className='bg-blue-800/50 rounded-lg p-3 mb-4'>
          <h4 className='font-medium text-blue-200 mb-2'>Looking for:</h4>
          <div className='flex flex-wrap gap-2'>
            {selectedFish.exchange.lookingFor.map((trait, index) => (
              <span
                key={index}
                className='text-xs px-2 py-1 bg-blue-700/50 rounded-full text-blue-100'
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div className='mb-4'>
          <h4 className='font-medium text-blue-200 mb-2'>
            Select a fish to offer:
          </h4>
          <div className='space-y-2 max-h-60 overflow-y-auto pr-2'>
            {myFish.map(fish => (
              <div
                key={fish.id}
                className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedOffer === fish.id
                    ? 'bg-blue-700/70 border border-blue-500'
                    : 'bg-blue-800/50 border border-blue-700/50 hover:bg-blue-700/50'
                }`}
                onClick={() => setSelectedOffer(fish.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedOffer(fish.id);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={selectedOffer === fish.id}
              >
                <div className='w-12 h-12 bg-blue-900/50 rounded overflow-hidden flex items-center justify-center mr-3'>
                  <img
                    src={fish.image || '/placeholder.svg?height=40&width=40'}
                    alt={fish.name}
                    className='w-10 h-10 object-contain'
                  />
                </div>
                <div>
                  <h5 className='font-medium'>{fish.name}</h5>
                  <div className='flex items-center space-x-2 mt-0.5'>
                    <RarityBadge rarity={fish.rarity} />
                    <span className='text-xs text-blue-300'>
                      Level {fish.level}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {myFish.length === 0 && (
              <div className='text-center py-4 text-blue-300'>
                You don't have any fish to offer
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={close} className='text-black'>
            Cancel
          </Button>
          <Button
            className='bg-purple-500 hover:bg-purple-600'
            onClick={handleSubmit}
            disabled={selectedOffer === null}
          >
            Send Offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
