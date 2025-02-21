import React from "react";
import { decodedToken } from "../utils/decodedToken";

const ElesTestPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
          <div className="text-white text-xl bg-purple-500 px-4 py-2 rounded-lg shadow-lg">
                  Player is {"  "} 
                           <span className="font-bold text-yellow-300">
                           ❝ {decodedToken?.username || "Guest"} ❞
                  </span>
                </div>

        <div className="flex gap-4 items-center">
          <div className="bg-white/10 px-4 py-2 rounded-lg">
            ⏳<span className="text-xl font-bold text-white">{0} s</span>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-lg">
            ✏️
            <span className="text-xl font-bold text-white">WPM {0}</span>
          </div>

          <div className="bg-white/10 px-4 py-2 rounded-lg">
            ✍️
            <span className="text-xl font-bold text-white">
            accuracy {}%
            </span>
          </div>
        </div>
      </div>

      <div className="text-2xl text-white mb-6 font-mono">
        👈 Select a Challenge ...
      </div>
    </div>
  );
};

export default ElesTestPage;
