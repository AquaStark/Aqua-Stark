import { ArrowLeft, Beaker, Search } from "lucide-react";
import { Link } from "react-router-dom";

export function LaboratoryHeader() {
  return (
    <div className="bg-blue-900/40 backdrop-blur-sm px-3 py-4">
      <div className="text-gray-200 flex items-center justify-between w-[85%] mx-auto">
        <div className="flex items-center gap-4">
          <Link to='/' className="flex itemes-center gap-2 text-sm">
            <ArrowLeft size={20} /> Back to Game
          </Link>
          <h2 className="text-2xl font-semibold">Breeding Laboratory</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-blue-600/30 flex items-center px-2 py-1 gap-6 rounded border border-blue-600/60">
            <input type="text" placeholder="Search discoveries" className="bg-transparent px-2 py-1" />
            <Search size={16} />
          </div>

          <div className="bg-purple-700 py-2 px-5 w-full rounded">
            <button className="justify-center flex items-center gap-2">
              <Beaker size={20} /> Lab Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}