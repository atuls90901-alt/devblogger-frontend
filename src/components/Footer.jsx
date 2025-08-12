import React from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between">
        
        {/* Logo / Copyright */}
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Atul Chaudhary. All Rights Reserved.
        </p>

        {/* Social Links */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-pink-500 transition text-xl"
          >
            <FaInstagram />
          </a>
          <a
            href="https://wa.me/919999999999" // Replace with your WhatsApp number
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-500 transition text-xl"
          >
            <FaWhatsapp />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
