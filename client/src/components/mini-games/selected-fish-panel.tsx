interface SelectedFishPanelProps {
  selectedFish: {
    id: string;
    name: string;
    image: string;
  };
  onChangeFish: () => void;
  availableFish: Array<{ id: string; name: string; image: string }>;
}

export function SelectedFishPanel({
  selectedFish,
  onChangeFish,
}: SelectedFishPanelProps) {
  return (
    <section className='w-full bg-blue-800/30 border border-blue-600/30 rounded-xl p-4 sm:p-6 flex items-center justify-between shadow-sm'>
      <div className='flex items-center gap-3 sm:gap-6'>
        <div className='w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center'>
          <img
            src={selectedFish.image}
            alt={selectedFish.name}
            className='w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain'
          />
        </div>
        <div>
          <h2 className='text-white text-lg sm:text-xl font-bold'>Your Fish</h2>
          <p className='text-blue-200 text-xs sm:text-sm'>
            {selectedFish.name}
          </p>
        </div>
      </div>
      <button
        onClick={onChangeFish}
        className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 sm:px-4 rounded-md font-semibold transition text-sm sm:text-base'
      >
        Change Fish
      </button>
    </section>
  );
}
