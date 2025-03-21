export function FishStatusTips() {
    return (
        <div className="w-full max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-8 drop-shadow-lg">Game Tips</h2>
        <div className="bg-blue-600/50 rounded-3xl p-8 backdrop-blur-sm border-2 border-blue-400/50">
          <h3 className="text-2xl font-bold text-white mb-4">Get to know the State Bars</h3>
          <p className="text-white/90 mb-6">
            In Aqua Stark, each fish has three status bars that you must monitor to keep them happy and healthy:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div className="flex flex-col items-center">
              <div className="relative h-40 w-12 bg-white/30 rounded-full mb-2 overflow-hidden border-2 border-white/50">
                <div
                  className="absolute bottom-0 w-full bg-green-500 transition-all duration-500"
                  style={{ height: "90%" }}
                ></div>
              </div>
              <div className="text-center text-2xl mb-2">😃</div>
              <div className="text-center">
                <h4 className="font-bold text-white">Happiness</h4>
                <p className="text-white/80 text-sm">
                  Keep your fish happy with decorations and regular attention.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative h-40 w-12 bg-white/30 rounded-full mb-2 overflow-hidden border-2 border-white/50">
                <div
                  className="absolute bottom-0 w-full bg-orange-500 transition-all duration-500"
                  style={{ height: "50%" }}
                ></div>
              </div>
              <div className="text-center text-2xl mb-2">😐</div>
              <div className="text-center">
                <h4 className="font-bold text-white">Hunger</h4>
                <p className="text-white/80 text-sm">
                  Feed your fish regularly to keep this bar full.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative h-40 w-12 bg-white/30 rounded-full mb-2 overflow-hidden border-2 border-white/50">
                <div
                  className="absolute bottom-0 w-full bg-red-500 transition-all duration-500"
                  style={{ height: "20%" }}
                ></div>
              </div>
              <div className="text-center text-2xl mb-2">😟</div>
              <div className="text-center">
                <h4 className="font-bold text-white">Energy</h4>
                <p className="text-white/80 text-sm">Let your fish rest to regain their energy.</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-700/50 rounded-xl p-4 border border-blue-400/30">
            <p className="text-white/90 text-center">
              <span className="font-bold">PRO TIP!</span> Keep all bars above 50% to unlock special behaviors in your fish.
            </p>
          </div>
        </div>
      </div>
    )
}