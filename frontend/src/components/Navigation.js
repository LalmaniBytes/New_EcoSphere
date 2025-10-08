import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { MapPin, FileText, User, LogIn, UserPlus, Menu, X } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-emerald-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🌍</span>
            </div>
            <span className="gradient-text">EcoSphere</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                className={`flex items-center space-x-2 ${
                  isActive('/') ? 'bg-emerald-500 hover:bg-emerald-600' : 'hover:bg-emerald-50'
                }`}
                data-testid="nav-home-btn"
              >
                <MapPin className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>

            <Link to="/report">
              <Button
                variant={isActive('/report') ? 'default' : 'ghost'}
                className={`flex items-center space-x-2 ${
                  isActive('/report') ? 'bg-emerald-500 hover:bg-emerald-600' : 'hover:bg-emerald-50'
                }`}
                data-testid="nav-report-btn"
              >
                <FileText className="h-4 w-4" />
                <span>Report Issue</span>
              </Button>
            </Link>

            <Link to="/joinhands">
              <Button
                variant={isActive('/joinhands') ? 'default' : 'ghost'}
                className={`flex items-center space-x-2 ${
                  isActive('/joinhands') ? 'bg-emerald-500 hover:bg-emerald-600' : 'hover:bg-emerald-50'
                }`}
                data-testid="nav-joinhands-btn"
              >
               
                <span> 🤝 Join Hands </span>
              </Button>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center space-x-2 border-emerald-200 hover:bg-emerald-50"
              data-testid="login-btn"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Button>

            <Button
              size="sm"
              className="hidden sm:flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600"
              data-testid="signup-btn"
            >
              <UserPlus className="h-4 w-4" />
              <span>Sign Up</span>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
              data-testid="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 flex flex-col space-y-1 pb-2">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                className={`w-full flex items-center space-x-2 ${
                  isActive('/') ? 'bg-emerald-500 hover:bg-emerald-600' : 'hover:bg-emerald-50'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>

            <Link to="/report" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={isActive('/report') ? 'default' : 'ghost'}
                className={`w-full flex items-center space-x-2 ${
                  isActive('/report') ? 'bg-emerald-500 hover:bg-emerald-600' : 'hover:bg-emerald-50'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Report Issue</span>
              </Button>
            </Link>

            <Link to="/chat" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={isActive('/chat') ? 'default' : 'ghost'}
                className={`w-full flex items-center space-x-2 ${
                  isActive('/chat') ? 'bg-emerald-500 hover:bg-emerald-600' : 'hover:bg-emerald-50'
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                <span>AI Assistant</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
