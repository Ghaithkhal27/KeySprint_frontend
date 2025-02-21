import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { decodedToken } from "../utils/decodedToken";
import { getAllLevels, setUserInput } from "../redux/gameSlice";
import { useLocation } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useGameLogic } from "../hooks/useGameLogic";
import { socket } from "../socketService/socket";
import { motion } from "framer-motion";
import { BoltIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";

const LevelsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const groupId = location.state?.GroupId;
  const gameId = location.state?.gameId;
  const [opponentProgress, setOpponentProgress] = useState<{
    username: string;
    level: number;
    playerId: string;
  }>();

  const { levels, currentLevelIndex, userInput, timeLeft, correctChars } =
    useAppSelector((state) => state.game);
  const currentLevel = levels[currentLevelIndex];

  useEffect(() => {
    if (groupId) {
      dispatch(getAllLevels(groupId));
    }
  }, [dispatch, groupId]);

  useGameLogic();

  const getCharClass = (index: number) => {
    if (!userInput[index] || !currentLevel || !currentLevel.text) return "";
    return currentLevel.text[index] === userInput[index]
      ? "text-green-400"
      : "text-red-500 underline";
  };



  useEffect(() => {
    const handleProgress = (progress: {
      username: string;
      level: number;
      playerId: string;
    }) => {
      if (progress.playerId !== decodedToken?.id) {
        setOpponentProgress(progress);
      }
    };
    socket.on("playerProgress", handleProgress);
    return () => {
      socket.off("playerProgress", handleProgress);
    };
  }, []); 

  const handleExitGame = () => {
    if (gameId && decodedToken?.id) {
      socket.emit("gameExit", { gameId, playerId: decodedToken.id });
    }
  };

  const sendProgressUpdate = () => {
    if (gameId && decodedToken?.id) {
      socket.emit("progressUpdate", {
        gameId,
        playerId: decodedToken.id,
        level: currentLevelIndex + 1,
      });
    }
  };

  useEffect(() => {
    if (currentLevel?.text === userInput && currentLevelIndex < levels.length - 1) {
      sendProgressUpdate();
    }
  }, [userInput, currentLevelIndex, levels, gameId]); // Added gameId to deps

  const logo = ["K", "e", "y", "S", "p", "r", "i", "n", "t"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-[#0091ad] py-10 px-6 md:px-20">
      <nav className="w-full bg-gradient-to-r from-indigo-900 to-[#1565c0] p-0.5 fixed top-0 left-0 right-0 z-50 shadow-2xl">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer">
            <span className="flex items-center space-x-0 gap-0.5 text-white text-2xl font-bold font-mono tracking-wide">
              <motion.span whileHover={{ y: -5 }}>
                <BoltIcon className="h-7 w-7" />
              </motion.span>
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
          <button
            className="flex group px-4 py-2 bg-[#b7e4c7] hover:bg-[#0091ad] text-[#38040e] font-bold font-mono rounded-lg transition-all"
            onClick={handleExitGame}
          >
            <ArrowLeftStartOnRectangleIcon className="h-6 w-6 text-[#38040e] group-hover:text-black" />
            <span className="group-hover:text-black">Exit Match</span>
          </button>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto mt-20">
        <div className="bg-gradient-to-br from-[#0091ad]/80 to-indigo-900/80 backdrop-blur-lg rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="text-white text-xl bg-purple-500 px-4 py-2 rounded-lg shadow-lg">
              Player: <span className="font-bold text-yellow-300">❝ {decodedToken?.username || "Guest"} ❞</span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <div className="w-15 h-15">
                  <CircularProgressbar
                    value={timeLeft}
                    text={`${timeLeft}s`}
                    styles={{ path: { stroke: "#3B82F6" }, text: { fill: "#fff", fontSize: "24px" } }}
                  />
                </div>
                <span className="text-white">Time Left</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-3 rounded-lg">
                ✍️ <span className="text-2xl font-bold text-white">{correctChars}/{currentLevel?.text.length}</span>
              </div>
              {opponentProgress && (
                <div className="text-white bg-purple-500 px-4 py-2 rounded-lg shadow-lg">
                  {opponentProgress.username} on Level: {opponentProgress.level}
                </div>
              )}
            </div>
          </div>
          <div className="text-2xl text-white mb-6 font-mono">
            {currentLevel?.text?.split("").map((char, i) => (
              <span key={i} className={getCharClass(i)}>{char}</span>
            )) || "Loading..."}
          </div>
          <input
            type="text"
            value={userInput}
            onChange={(e) => dispatch(setUserInput(e.target.value))}
            className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Start typing here..."
          />
        </div>
      </div>
    </div>
  );
};

export default LevelsPage;