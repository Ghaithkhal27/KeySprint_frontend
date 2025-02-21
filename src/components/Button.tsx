import React from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className=" flex items-center space-x-1 bg-[#f75c03]/60  border border-white/20 hover:border-white/40  font-semibold px-5 py-2.5 rounded-xl hover:bg-[#f75c03]/80 "
    >
      <HiOutlineLogout className="w-5 h-5 text-indigo-900  "/> 
      <span className="text-indigo-900 ">
        Logout
      </span>
    </button>
  );
};
/////////////////////////////////////

export const ButtonStart: React.FC = () => {
  return (
    <button className="group relative flex items-center justify-center gap-3 px-6 py-3 font-medium text-white from-indigo-900 to-[#1565c0] rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-indigo-700 hover:to-purple-700">
      <span className="absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-300 group-hover:border-indigo-300" />

      <span className="text-2xl">
        🎮
      </span>

      <span className="text-lg">Start</span>
    </button>
  );
};

