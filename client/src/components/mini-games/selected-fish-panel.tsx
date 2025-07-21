interface SelectedFishPanelProps {
    selectedFish: {
      id: string
      name: string
      image: string
    }
    onChangeFish: () => void
    availableFish: Array<{ id: string; name: string; image: string }>
  }
  
  export function SelectedFishPanel({ selectedFish, onChangeFish }: SelectedFishPanelProps) {
    return (
      <section className="w-full bg-blue-800/30 border border-blue-600/30 rounded-xl p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 flex items-center justify-center">
            <img
              src={selectedFish.image}
              alt={selectedFish.name}
              className="w-24 h-24 object-contain"
            />
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">Your Fish</h2>
            <p className="text-blue-200 text-sm">{selectedFish.name}</p>
          </div>
        </div>
        <button
          onClick={onChangeFish}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold transition"
        >
          Change Fish
        </button>
      </section>
    )
  }
  