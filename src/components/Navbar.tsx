import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogoutButton } from "./Button";
import { BoltIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import {
  UserIcon,
  HomeModernIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const logo = ["K", "e", "y", "S", "p", "r", "i", "n", "t"];
  return (
    <nav className="w-full bg-gradient-to-r from-indigo-900 to-[#1565c0] p-0.5 fixed top-0 left-0 right-0 z-50 shadow-2xl ">
      <div className="container mx-auto flex justify-between items-center">
        <div
          className="flex items-center space-x-3 cursor-pointer "
          onClick={() => navigate("/HomePage")}
        >
          <span className="flex items-center space-x-0 gap-0.5 text-white text-2xl font-bold font-mono tracking-wide">
            
            <motion.span whileHover={{ y: -5 }}><BoltIcon className="h-7 w-7" /></motion.span>
            {logo.map((letter, index) => (
              <motion.span
                key={index}
                whileHover={{ y: -5 }}
                className="text-2xl font-bold font-poppins"
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </div>
        <div className="mr-10 "></div>

        <div className="flex items-center space-x-10">
          <NavItem to="/HomePage" icon={HomeModernIcon} label="Home" />
          <NavItem to="/TestPage" icon={CreditCardIcon} label="SoloTest" />
          <NavItem to="/profile" icon={UserIcon} label="Profile" />
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label }) => {
  return (
    <Link
      to={to}
      className="group relative flex flex-col items-center justify-center"
    >
      <div className="flex items-center space-x-2 transition-all duration-300  ">
        <Icon className="h-7 w-7 text-white transition-colors duration-300  group-hover:text-[#03045e] " />
        <span className="text-white font-medium transition-colors duration-300 group-hover:text-[#03045e]">
          {label}
        </span>
      </div>
      <span className="absolute bottom-0 w-0 h-[2px] bg-[#03045e] transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
};

export default Navbar;
