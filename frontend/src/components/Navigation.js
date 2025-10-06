import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { MapPin, MessageCircle, FileText, User, LogIn, UserPlus } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                className={`flex items-center space-x-2 ${isActive('/') ? 'bg-emerald-500 hover:bg-emerald-600' : 'hover:bg-emerald-50'}`}
                data-testid="nav-home-btn"
              >
                <MapPin className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>

            <Link to="/report">
              <Button
                variant={isActive('/report') ? 'default' : 'ghost'}
                className={`flex items-center space-x-2 ${isActive('/report') ? 'bg-emerald-500 hover:bg-emerald-600' : 'hover:bg-emerald-50'}`}
                data-testid="nav-report-btn"
              >
                <FileText className="h-4 w-4" />
                <span>Report Issue</span>
              </Button>
            </Link>

            <Link to="/chat">
              <Button
                variant={isActive('/chat') ? 'default' : 'ghost'}
                className={`flex items-center space-x-2 ${isActive('/chat') ? 'bg-emerald-500 hover:bg-emerald-600' : 'hover:bg-emerald-50'}`}
                data-testid="nav-chat-btn"
              >
                <MessageCircle className="h-4 w-4" />
                <span>AI Assistant</span>
              </Button>
            </Link>
          </div>

          {/* Auth Buttons (Frontend only for now) */}
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
            
            {/* Mobile menu button - for future implementation */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              data-testid="mobile-menu-btn"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;