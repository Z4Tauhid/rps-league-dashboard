import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Swords } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const menus = [
    { name: "Home", path: "/" },
    { name: "Match History", path: "/matchHistory" },
    { name: "Latest Matches", path: "/matches" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Player", path: "/player" },
  ];

  return (
    <>
       {/* Navbar  */}
      <nav className="shadow-md text-lime-400 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo + Hamburger */}
          <div className="flex items-center gap-3">

            {/* Hamburger */}
            <button
              className="md:hidden text-2xl"
              onClick={() => setOpen(true)}
            >
              ☰
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <Swords className="text-yellow-400 animate-pulse" size={36} />

              <motion.span
                className="text-lg sm:text-xl md:text-2xl font-bold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                RPS Arena
              </motion.span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-center lg:justify-evenly gap-6 lg:gap-12">

            {menus.map((menu) => (
              <Link
                key={menu.name}
                to={menu.path}
                className="text-base lg:text-lg font-semibold hover:text-yellow-400 transition"
              >
                {menu.name}
              </Link>
            ))}

          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-linear-to-b from-[#0f2a5c] to-[#08122c] text-yellow-400 shadow-lg transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="font-bold text-lg">Menu</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {menus.map((menu) => (
            <Link
              key={menu.name}
              to={menu.path}
              onClick={() => setOpen(false)}
              className="text-lg hover:text-lime-400 transition"
            >
              {menu.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}
    </>
  );
};

export default Navbar;