import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-emerald-900 text-slate-300 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand & Mission */}
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-2xl font-bold text-emerald-500 mb-4">EcoSphere</h2>
          <p className="text-sm leading-relaxed">
            A unified, AI-powered ecosystem connecting environmental awareness, 
            civic action, and mental well-being for healthier urban communities.
          </p>
        </div>

        {/* Updated Platform Portion */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Platform</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/report-issue"
              onClick={() => window.scrollTo(0, 0)}
              className="hover:text-emerald-400 transition">Report Issue</Link>
            </li>
            <li>
              <Link to="/joinhands?mode=start"
               onClick={() => window.scrollTo(0, 0)}
               className="hover:text-emerald-400 transition">Start a Cleanup Drive</Link>
            </li>
            <li>
              <Link to="/joinhands?mode=join" 
              onClick={() => window.scrollTo(0, 0)}
              className="hover:text-emerald-400 transition">Join a Cleanup Drive</Link>
            </li>
            <li>
              <Link to="/mentalhealth" 
              onClick={() => window.scrollTo(0, 0)}
              className="hover:text-emerald-400 transition">Vibe Cure</Link>
            </li>
          </ul>
        </div>

        {/* Data & Resources */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-emerald-400 transition">Air Quality Index</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition">Risk Scores</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition">NGO Partnerships</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition">Sustainability Blog</a></li>
          </ul>
        </div>

        {/* Newsletter / Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Stay Updated</h3>
          <p className="text-sm mb-4">Join our mission for a cleaner, healthier future.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-slate-800 border-none rounded-l-md px-4 py-2 w-full focus:ring-1 focus:ring-emerald-500 text-white outline-none"
            />
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-r-md transition">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs">
        <p>&copy; {new Date().getFullYear()} EcoSphere. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <li>
              <Link to="/About"
               onClick={() => window.scrollTo(0, 0)}
               className="hover:text-emerald-400 transition">About Us</Link>
            </li>
        </div>
      </div>
    </footer>
  );
};

export default Footer;