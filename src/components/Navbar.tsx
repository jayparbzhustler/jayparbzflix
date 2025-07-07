import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { useData } from '../context/DataContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { setSearchQuery, user } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      setSearchQuery(query);
      navigate('/search');
      setShowSearch(false);
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'TV Shows', path: '/tv' },
    { name: 'Movies', path: '/movies' },
    { name: 'My List', path: '/my-list' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-gradient-to-b from-black/80 to-transparent'
    }`}>
      <div className="px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-red-600 text-2xl font-bold tracking-wide">
              JayParbzFlix
            </Link>
            
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-white hover:text-gray-300 transition-colors duration-200 ${
                    location.pathname === item.path ? 'font-semibold' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {showSearch ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    name="search"
                    type="text"
                    placeholder="Search titles, people, genres"
                    className="bg-black/70 border border-white/30 rounded px-4 py-2 text-white placeholder-gray-400 w-64 focus:outline-none focus:border-white/60"
                    autoFocus
                    onBlur={() => setShowSearch(false)}
                  />
                </form>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="text-white hover:text-gray-300 transition-colors duration-200"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Notifications */}
            <button className="text-white hover:text-gray-300 transition-colors duration-200">
              <Bell size={20} />
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                  <User size={16} />
                </div>
                <ChevronDown size={16} className={`transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm border border-white/20 rounded-md py-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors duration-200"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Manage Profiles
                  </Link>
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-white hover:bg-white/10 transition-colors duration-200"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Account
                  </Link>
                  <div className="border-t border-white/20 my-2"></div>
                  <button className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors duration-200">
                    Sign out of JayParbzFlix
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-6 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-white hover:text-gray-300 transition-colors duration-200 whitespace-nowrap ${
                  location.pathname === item.path ? 'font-semibold' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
