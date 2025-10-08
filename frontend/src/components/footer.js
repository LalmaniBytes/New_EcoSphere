// Footer.js
import React from "react";
import { MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#10B891] text-white py-8 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center px-4 gap-6">
        
        {/* Logo & Description */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">EcoSphere</h1>
          <p className="text-sm max-w-xs">
            Your go-to platform for real-time weather updates and environmental awareness.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Quick Links</h2>
          <a href="/" className="hover:underline">Home</a>
          <a href="/about" className="hover:underline">About</a>
          <a href="/services" className="hover:underline">Services</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold">Contact Us</h2>
          <div className="flex items-center gap-2">
            <MapPin size={16} /> <span>Delhi, India</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} /> <span>info@ecosphere.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} /> <span>+91 9876543210</span>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-6 border-t border-white/30 pt-4 text-center text-sm">
        &copy; {new Date().getFullYear()} EcoSphere. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

