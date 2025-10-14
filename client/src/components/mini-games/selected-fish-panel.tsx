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
    <section className='w-full bg-blue-800/30 border border-blue-600/30 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 flex items-center justify-between shadow-sm'>
      <div className='flex items-center gap-2 sm:gap-3 md:gap-4'>
        <div className='w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center'>
          <img
            src={selectedFish.image}
            alt={selectedFish.name}
            className='w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain'
          />
        </div>
        <div>
          <h2 className='text-white text-sm sm:text-base md:text-lg font-bold'>
            Your Fish
          </h2>
          <p className='text-blue-200 text-xs sm:text-sm'>
            {selectedFish.name}
          </p>
        </div>
      </div>
      <button
        onClick={onChangeFish}
        className='bg-blue-600 hover:bg-blue-700 text-white py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 rounded-md font-semibold transition text-xs sm:text-sm md:text-base'
      >
        Change Fish
      </button>
    </section>
  );
}
