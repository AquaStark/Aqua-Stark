import { SpecialBundle } from "@/data/mock-store";

interface StoreBundleProps {
  bundle: SpecialBundle;
  onBuy: (bundle: SpecialBundle) => void;
}

const getBundleGradient = (bundleType?: string) => {
  switch (bundleType) {
    case "decorations":
      return "from-blue-700 to-green-700";
    case "food":
      return "from-blue-700 to-orange-700";
    default:
      return "";
  }
};

const savingsPercentage = (data: SpecialBundle) => {
  const priceDifference = data.originalPrice - data.price;
  const percentage = (priceDifference / data.originalPrice) * 100;
  return Math.round(percentage);
};

export function StoreBundle({ bundle, onBuy }: StoreBundleProps) {
  return (
    <div
      className={`flex flex-col p-4 mb-4 overflow-hidden rounded-lg bg-gradient-to-r md:items-center md:flex-row ${getBundleGradient(
        bundle.type
      )}`}
    >
      <div className="flex flex-col flex-1 ">
        <h3 className="text-lg font-bold text-white">
          {bundle.name.toUpperCase()}
        </h3>
        <p className="mb-2 text-sm font-light text-blue-100">
          Includes: {bundle.itemsDescription}
        </p>

        <div className="flex items-center gap-3 mt-auto">
          <span className="text-sm text-gray-300 line-through">
            {bundle.originalPrice} coins
          </span>
          <span className="font-bold text-white">{bundle.price} coins</span>

          <div className="px-2 py-1 text-xs font-bold text-white bg-green-500 rounded-full shadow-lg">
            {savingsPercentage(bundle)}% SAVINGS
          </div>
        </div>
      </div>

      <img
        src={bundle.image}
        alt={bundle.name}
        className="hidden w-20 h-w-20 md:block"
      />

      <div className="flex items-center justify-center mt-4 md:ml-3 md:mt-0">
        <button
          onClick={() => onBuy(bundle)}
          className="px-3 py-1.5 font-bold text-blue-100 rounded bg-yellow-500/90 hover:text-white hover:bg-yellow-600"
        >
          Buy Bundle
        </button>
      </div>
    </div>
  );
}
