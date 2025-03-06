
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, User, LogIn } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Find Jobs", href: "/jobs" },
    { label: "Post a Job", href: "/jobs/post" },
    { label: "Candidates", href: "#" },
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-semibold">JP</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 tracking-wide">Jobpilot</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`text-gray-800 hover:text-gray-900 transition-colors duration-200 ${
                  location.pathname === item.href ? "text-primary font-medium" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/auth/login" className="flex items-center gap-1.5 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <Link to="/profile" className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200">
              <User className="w-4 h-4" />
              Profile
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.href
                    ? "text-primary bg-gray-50"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col space-y-2 px-3 justify-end">
              <Link to="/auth/login" className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link to="/profile" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
