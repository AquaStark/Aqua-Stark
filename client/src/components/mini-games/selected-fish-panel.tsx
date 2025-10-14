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
    <section className='w-full bg-blue-800/30 border border-blue-600/30 rounded-md sm:rounded-lg p-1 sm:p-2 md:p-3 flex items-center justify-between shadow-sm'>
      <div className='flex items-center gap-1 sm:gap-2 md:gap-3'>
        <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center'>
          <img
            src={selectedFish.image}
            alt={selectedFish.name}
            className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain'
          />
        </div>
        <div>
          <h2 className='text-white text-xs sm:text-sm md:text-base font-bold'>
            Your Fish
          </h2>
          <p className='text-blue-200 text-xs'>
            {selectedFish.name}
          </p>
        </div>
      </div>
      <button
        onClick={onChangeFish}
        className='bg-blue-600 hover:bg-blue-700 text-white py-1 sm:py-1.5 md:py-2 px-1.5 sm:px-2 md:px-3 rounded-sm sm:rounded-md font-semibold transition text-xs sm:text-sm'
      >
        Change Fish
      </button>
    </section>
  );
}
