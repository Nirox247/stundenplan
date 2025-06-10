import React, { useState } from "react";
import { Check, Menu, X } from "lucide-react";
import ColorPalets from "./ColorPalets";

const NavBar = () => {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/home" },
    { name: "Timetable", href: "/timetable" },
    { name: "DeleteNews", href: "/deleteNews" },
    { name: "Upload", href: "/upload" },
    { name: "Login", href: "/login" },
    { name: "Profile", href: "/profile" },
    { name: "Test", href: "/test" },
    { name: "UsersInfo", href: "/usersInfo" },
  ];

  // Inline-Styles mit Farben aus ColorPalets
  const buttonStyle = {
    background: `linear-gradient(to top right, ${ColorPalets.accentLight}, ${ColorPalets.success})`,
    color: "white",
  };

  const hoverButtonStyle = {
    backgroundColor: ColorPalets.primaryDark,
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-lg transition duration-300"
        style={buttonStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = ColorPalets.primaryDark)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = `linear-gradient(to top right, ${ColorPalets.accentLight}, ${ColorPalets.success})`)
        }
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div
          className="fixed bottom-24 left-6 z-6 rounded-xl shadow-2xl p-8 transition-all
          duration-300 bg-white animate-slide-up min-w-[200px]"
          style={{
            backgroundColor: ColorPalets.backgroundLight,
            color: ColorPalets.textPrimary,
          }}
        >
          <nav className="flex flex-col space-y-4 text-left">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-lg font-semibold px-4 py-2 rounded-lg transition"
                style={{ color: ColorPalets.primaryDark }}
                onMouseEnter={(e) => (
                  (e.currentTarget.style.background = `linear-gradient(to right,
                     ${ColorPalets.accentLight}, ${ColorPalets.accent})`),
                  (e.currentTarget.style.color = ColorPalets.success)
                )}
                onMouseLeave={(e) => (
                  (e.currentTarget.style.background = "transparent"),
                  (e.currentTarget.style.color = ColorPalets.primaryDark)
                )}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default NavBar;
