import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header>
      <div className="content-fit">
        {/* Logo */}
        <Link to="/" className="logo text-2xl font-bold text-white">
          ibeSuperV
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="relative flex items-center gap-6 text-white font-semibold">
            {/* Visualize Dropdown */}
            <li className="relative">
              <span
                className="cursor-pointer hover:text-yellow-300 transition"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                Visualize ▾
              </span>

              {showDropdown && (
                <ul
                  className="absolute top-full left-0 mt-2 w-56 bg-[#1B1B1B] border border-[#445022] rounded shadow-lg z-[999] flex flex-col"
                >
                  <li>
                    <Link
                      to="/#intro"
                      className="block px-4 py-2 hover:bg-[#445022]"
                      onClick={() => setShowDropdown(false)}
                    >
                      Graph Traversals
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/#recursion"
                      className="block px-4 py-2 hover:bg-[#445022]"
                      onClick={() => setShowDropdown(false)}
                    >
                      Recursion Tree
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/#heap"
                      className="block px-4 py-2 hover:bg-[#445022]"
                      onClick={() => setShowDropdown(false)}
                    >
                      Heap Sort
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/#horspool"
                      className="block px-4 py-2 hover:bg-[#445022]"
                      onClick={() => setShowDropdown(false)}
                    >
                      Horspool
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/#prim"
                      className="block px-4 py-2 hover:bg-[#445022]"
                      onClick={() => setShowDropdown(false)}
                    >
                      Prim’s Algorithm
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link
                to="/#contact"
                className="hover:text-yellow-300 transition"
              >
                Projects
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
