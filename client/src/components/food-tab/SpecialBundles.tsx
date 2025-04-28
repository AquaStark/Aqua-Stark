import BasicFood from "@/../public/items/basic-food.png";
import PremiumFood from "@/../public/items/premium-food.png";
import SpecialBundle from "/icons/special.png";

function SpecialBundles() {
  const bundles = [
    {
      title: "NUTRITION PACK",
      description: "Includes: BASIC FOOD, PREMIUM FOOD, SPECIAL FOOD",
      originalPrice: 1500,
      discountedPrice: 1200,
      savings: "20% SAVINGS",
      image: BasicFood,
    },
    {
      title: "GOURMET COLLECTION",
      description: "Includes: PREMIUM FOOD, SPECIAL FOOD, LEGENDARY FOOD",
      originalPrice: 2500,
      discountedPrice: 2000,
      savings: "20% SAVINGS",
      image: PremiumFood,
    },
  ];

  return (
    <div className="mt-8">
      <div className="flex">
        <img src={SpecialBundle} alt="" className="mb-4" />
        <h2 className="text-lg font-bold mb-4">Special Bundles</h2>
      </div>

      <div className="flex justify-between gap-6">
        {bundles.map((bundle) => (
          <div
            key={bundle.title}
            className="bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg p-4 flex justify-between items-center"
          >
            <div className="w-full">
              <h3 className="text-xl font-bold mb-2">{bundle.title}</h3>
              <p className="text-sm mb-4">{bundle.description}</p>
              <div className="flex items-center gap-4 mb-4">
                <span className="line-through text-gray-200">
                  {bundle.originalPrice} coins
                </span>
                <span className="text-white font-bold">
                  {bundle.discountedPrice} coins
                </span>
                <span className="bg-green-400 text-black text-xs px-2 py-1 rounded-full">
                  {bundle.savings}
                </span>
              </div>
            </div>
            <div className="flex items-center w-full gap-2">
              <img
                src={bundle.image}
                alt={bundle.title}
                className="w-24 h-24 object-contain"
              />
              <button className="bg-yellow-400 text-black font-bold text-xs py-1 px-3 rounded-md">
                Buy Bundle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpecialBundles;
