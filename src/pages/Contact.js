import React from "react";
import { Mail, Instagram, Facebook, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../assets/logo_alb.svg";
import fonts from "../fonts.css";

export default function Contact() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden">
      <img
        src={logo}
        alt="Gazeta CNVA logo decorativ"
        className="absolute bottom-[-45px] right-[-60px] w-[420px] opacity-30"
      />

      <motion.div
        className="z-10 text-center space-y-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-6xl font-extrabold text-black">Contact</h1>

        <div className="flex flex-col space-y-6 text-xl text-black font-medium">
          <a
            href="https://www.instagram.com/gazeta.cnva"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 justify-center hover:scale-105 transition-transform duration-200"
          >
            <Instagram className="w-7 h-7" />
            <span>@gazeta.cnva</span>
          </a>

          <a
            href="https://www.facebook.com/share/tb23hXQNmTnYPok5"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 justify-center hover:scale-105 transition-transform duration-200"
          >
            <Facebook className="w-7 h-7" />
            <span>Gazeta CNVA</span>
          </a>

          <a
            href="https://www.youtube.com/@gazetacnva"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 justify-center hover:scale-105 transition-transform duration-200"
          >
            <Youtube className="w-7 h-7" />
            <span>@gazetacnva</span>
          </a>

          <a
            href="mailto:gazeta@cnva.eu"
            className="flex items-center space-x-3 justify-center hover:scale-105 transition-transform duration-200"
          >
            <Mail className="w-7 h-7" />
            <span>gazeta@cnva.eu</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
