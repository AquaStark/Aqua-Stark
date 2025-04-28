function Navbar() {
  const tabs = ["FISH", "FOOD", "DECORATIONS", "OTHERS"];
  const activeTab = "FOOD";

  return (
    <nav className="flex gap-6 mb-6 font-bold">
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`cursor-pointer px-2 ${
            tab === activeTab
              ? "text-white bg-blue-800 underline decoration-orange-400 underline-offset-4"
              : "hover:underline hover:decoration-white"
          }`}
        >
          {tab}
        </div>
      ))}
    </nav>
  );
}

export default Navbar;
