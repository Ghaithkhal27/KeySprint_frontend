import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { decodedToken } from "../utils/decodedToken";
import {
  getAllTypingTest,
  setInitialTime,
  setSelectedText,
  setselectedTime,
  setshowResults,
  setUserInput,
  setCorrectChars,
  putScore,
} from "../redux/typingTestSlice";
import ElesTestPage from "../components/ElesTestPage";
import Confetti from "react-confetti";
import { enumRank } from "../utils/enumRank";
import { RootState } from "../redux/store";
import { useTypingStats } from "../hooks/useTypingStats";

const TestPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { wpm, accuracy } = useTypingStats();
  const {
    typingTest,
    selectedText,
    selectedTime,
    userInput,
    showResults,
  } = useAppSelector((state: RootState) => state.typing);

  const [active, setActive] = useState(false);

  useEffect(() => {
    dispatch(getAllTypingTest());
  }, [dispatch]);

  const handelSelectedTest = useCallback((test: string, time: number) => {
    dispatch(setSelectedText(test));
    dispatch(setselectedTime(time));
    dispatch(setInitialTime(time));
    dispatch(setUserInput(""));
    dispatch(setshowResults(false));
    setActive(true);
  }, [dispatch]);

  // Timer logic
  useEffect(() => {
    if (!active || !selectedTime) return;

    const timer = setInterval(() => {
      dispatch(setselectedTime(selectedTime - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [active, selectedTime, dispatch]);

  // Check for completion or time up
  useEffect(() => {
    if (!active) return;

    if (selectedTime === 0 || (selectedText && selectedText === userInput)) {
      setActive(false);
      dispatch(setshowResults(true));
    }
  }, [selectedTime, selectedText, userInput, active, dispatch]);

  const handelColor = (index: number) => {
    if (!selectedText) return "text-white";
    if (!userInput[index]) return "text-white";
    return selectedText[index] === userInput[index]
      ? "text-green-400"
      : "text-red-500";
  };

  useEffect(() => {
    let acc = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === selectedText[i]) {
        acc++;
      }
    }
    dispatch(setCorrectChars(acc));
  }, [userInput, selectedText, dispatch]);

  useEffect(() => {
    if (showResults && decodedToken?.id) {
      dispatch(
        putScore({
          accuracy,
          WPM: wpm,
          rank: enumRank(wpm),
          userId: decodedToken.id,
        })
      );
    }
  }, [showResults, accuracy, wpm, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length >= userInput.length) {
      dispatch(setUserInput(newValue));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-[#0091ad] py-10 px-6 md:px-20 relative">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white/10 backdrop-blur-lg rounded-xl p-4 h-fit">
          <h2 className="text-white text-2xl font-bold mb-4">
            Select a Challenge
          </h2>
          {typingTest.map((test) => (
            <div className="space-y-4" key={test.id}>
              <div className="cursor-pointer bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/20 transition-all w-full h-[100px]">
                <div
                  className="text-white flex items-center justify-between"
                  onClick={() => handelSelectedTest(test.text, test.timeLimit)}
                >
                  <div>
                    <h3 className="text-xl font-semibold">
                      {test.timeLimit}s Challenge
                    </h3>
                    <p className="text-sm text-gray-300 mt-1">
                      {test.text.split(" ").length} words
                    </p>
                    <div className="text-2xl">⏱️✏️</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-8 relative">
          <div className="absolute top-0 left-0 h-1 bg-purple-400 rounded-t-xl" />
          {selectedText ? (
            <div className="text-2xl text-white mb-6 font-mono">
              <div className="flex justify-between items-center mb-8">
                <div className="text-white text-xl bg-purple-500 px-4 py-2 rounded-lg shadow-lg">
                  Player is{" "}
                  <span className="font-bold text-yellow-300">
                    ❝ {decodedToken?.username || "Guest"} ❞
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="bg-white/10 px-4 py-2 rounded-lg">
                    ⏳
                    <span className="text-xl font-bold text-white">
                      {selectedTime} s
                    </span>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-lg">
                    ✏️
                    <span className="text-xl font-bold text-white">
                      WPM {wpm}
                    </span>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-lg">
                    ✍️
                    <span className="text-xl font-bold text-white">
                      accuracy {accuracy}%
                    </span>
                  </div>
                </div>
              </div>
              {selectedText.split("").map((char: string, index: number) => (
                <span key={index} className={handelColor(index)}>
                  {char}
                </span>
              ))}
            </div>
          ) : (
            <ElesTestPage />
          )}
          <div className="absolute bottom-4 left-0 right-0 px-8">
            <input
              value={userInput}
              onChange={handleInputChange} 
              onKeyDown={handleKeyDown} 
              type="text"
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              placeholder="Start typing here..."
              disabled={!selectedText || selectedTime <= 0}
            />
          </div>
          {showResults && (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-[#0091ad]/90 flex flex-col items-center justify-center rounded-xl">
              <Confetti width={700} height={600} />
              <h2 className="text-3xl font-bold text-white mb-4">
                Test Results
              </h2>
              <div className="text-6xl font-bold text-green-400 mb-4">
                {wpm} WPM
              </div>
              <div className="text-2xl text-white mb-6">
                accuracy {accuracy}%
              </div>
              <button
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all"
                onClick={() => {
                  dispatch(setshowResults(false));
                  dispatch(setSelectedText(""));
                  dispatch(setselectedTime(0));
                  dispatch(setUserInput(""));
                  setActive(false);
                }}
              >
                🚀 Select a New Challenge
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage;