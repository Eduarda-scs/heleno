import { X } from "lucide-react";
import { Link } from "react-router-dom";

const SidebarMenu = ({ open, onClose }) => {
  return (
    <>
      {/* === OVERLAY ESCURO === */}
      <div
        className={`fixed inset-0 bg-black/60 z-[100] transition-opacity duration-300
        ${open ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}`}
        onClick={onClose}
      />

      {/* === SIDEBAR LATERAL === */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 
        bg-[#1a1a1a] text-white
        shadow-2xl z-[101] p-6 pt-10 flex flex-col gap-6
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* BOTÃO DE FECHAR */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-yellow-400 transition-colors"
        >
          <X size={26} />
        </button>

        {/* TÍTULO */}
        <h2 className="text-xl font-bold">Menu Interno</h2>

        {/* LINKS */}
        <nav className="flex flex-col gap-4 mt-4 text-lg">
          <Link
            to="/dashboard"
            className="hover:text-yellow-400 transition-colors"
            onClick={onClose}
          >
            Dashboard
          </Link>

          <Link
            to="/cadastroimoveis"
            className="hover:text-yellow-400 transition-colors"
            onClick={onClose}
          >
            Imóveis
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default SidebarMenu;
