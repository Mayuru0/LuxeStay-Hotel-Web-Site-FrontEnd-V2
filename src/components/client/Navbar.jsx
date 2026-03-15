import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.jsx';
import { Menu, X, ChevronDown, User, CalendarDays, LogOut, Hotel } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { isAuthenticated, user, dispatch } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);

  /* Scroll-aware class switching */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
    navigate('/');
    setDropdownOpen(false);
  };

  const navLinks = [
    { name: 'Home',    path: '/' },
    { name: 'Rooms',   path: '/rooms' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About',   path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-md'
          : 'navbar-glass'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-blue-800 font-bold text-xl group"
          >
            <Hotel
              size={28}
              className="transition-transform duration-300 group-hover:rotate-12"
            />
            <span className="tracking-tight">LuxeStay</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-gray-700 hover:text-blue-800 font-medium transition-colors text-sm group"
              >
                {link.name}
                {/* Underline slide effect */}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-amber-500 rounded-full transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={
                      user.profilePic ||
                      `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=1e40af&color=fff`
                    }
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100"
                  />
                  <span className="text-sm font-medium text-gray-800">{user.firstName}</span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="dropdown-enter absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={14} /> Profile
                    </Link>
                    <Link
                      to="/my-bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <CalendarDays size={14} /> My Bookings
                    </Link>
                    {(user.role === 'Admin' || user.role === 'admin') && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-blue-700 hover:bg-blue-50 transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-sm font-semibold text-gray-700 hover:text-blue-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="text-sm font-semibold btn-gradient text-white px-5 py-2 rounded-lg shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu-enter md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 px-2 text-gray-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-gray-100 my-2" />
          {isAuthenticated ? (
            <>
              <Link to="/profile"     onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-gray-700 hover:bg-gray-50 rounded-lg">Profile</Link>
              <Link to="/my-bookings" onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-gray-700 hover:bg-gray-50 rounded-lg">My Bookings</Link>
              <button onClick={handleLogout} className="block py-2.5 px-2 text-red-600 font-medium w-full text-left hover:bg-red-50 rounded-lg">Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth/login"    onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-gray-700 hover:bg-gray-50 rounded-lg">Login</Link>
              <Link to="/auth/register" onClick={() => setMobileOpen(false)} className="block py-2.5 px-2 text-blue-800 font-semibold hover:bg-blue-50 rounded-lg">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
