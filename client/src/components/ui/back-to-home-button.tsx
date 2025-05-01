import { Link } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";

export default function BackToHomeButton() {
  return (
    <Link to={"/"}>
      <button className="flex items-center gap-2 px-6 py-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-full drop-shadow-[0_0_4px_rgba(136,191,255,0.7)] shadow-md shadow-[0_0_15px_0_rgba(56,189,248,0.6)] hover:scale-105 hover:from-cyan-300 hover:to-blue-400 active:brightness-90 transition-all">
        <AiOutlineHome />
        <span>Back to Home</span>
      </button>
    </Link>
  );
}
