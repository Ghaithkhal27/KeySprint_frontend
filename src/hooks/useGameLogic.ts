import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setCorrectChars,
  setcurrentLevelIndex,
  setTimeLeft,
  setUserInput,
} from "../redux/gameSlice";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { socket } from "../socketService/socket";
import { decodedToken } from "../utils/decodedToken";

export const useGameLogic = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { timeLeft, levels, currentLevelIndex, userInput } = useAppSelector((state) => state.game);
  const gameId = location.state?.gameId;
  const [isAlertActive, setIsAlertActive] = useState(false); // Prevent overlapping alerts

  useEffect(() => {
    if (levels.length === 0 || !gameId) return;

    const currentLevel = levels[currentLevelIndex];
    if (!currentLevel) return;

    // Calculate correct characters
    const correctChars = userInput
      .split("")
      .filter((char, i) => char === currentLevel.text[i]).length;
    dispatch(setCorrectChars(correctChars));

    const isLastLevel = currentLevelIndex === levels.length - 1;
    const isLevelComplete = userInput === currentLevel.text;

    // Handle game logic in a single flow
    const handleGameState = async () => {
      if (isAlertActive) return; // Prevent multiple alerts

      // Game Over (win condition)
      if (isLastLevel && isLevelComplete) {
        socket.emit("gameOver", { gameId, playerId: decodedToken.id });
        return; // Exit early, let socket handler deal with alert
      }

      // Time's up
      if (timeLeft === 0) {
        setIsAlertActive(true);
        await Swal.fire({
          title: "Time's Up!",
          text: "Restarting the timer...",
          icon: "warning",
          confirmButtonText: "OK",
          background: "#1a1a2e",
          color: "#fff",
        });
        setIsAlertActive(false);
        dispatch(setTimeLeft(currentLevel.timeLimit));
        dispatch(setUserInput(""));
        return;
      }

      // Level completion (not last level)
      if (isLevelComplete && !isLastLevel) {
        dispatch(setcurrentLevelIndex(currentLevelIndex + 1));
        dispatch(setUserInput(""));
        dispatch(setTimeLeft(levels[currentLevelIndex + 1].timeLimit));
      }
    };

    // Timer logic
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setInterval(() => dispatch(setTimeLeft(timeLeft - 1)), 1000);
    }
    handleGameState();

    // Socket gameOver handler
    const handleGameOver = (data: {
      gameId: string;
      winnerId: string;
      loserId: string;
      status: "WON" | "LOST";
      reason?: "self_exit" | "opponent_exit";
    }) => {
      if (isAlertActive) return;
      setIsAlertActive(true);

      const isWinner = data.winnerId === decodedToken.id;
      const title = data.reason === "opponent_exit" && isWinner
        ? "You Won! 🎉"
        : data.reason === "self_exit" && !isWinner
        ? "Game Over! 😢"
        : isWinner
        ? "You Won! 🎉"
        : "You Lost! 😢";
      const text = data.reason === "opponent_exit" && isWinner
        ? "Your opponent has left the game!"
        : data.reason === "self_exit" && !isWinner
        ? "You abandoned the match!"
        : isWinner
        ? "Congratulations on your victory!"
        : "Better luck next time!";
      const icon = isWinner ? "success" : "error";

      Swal.fire({
        title,
        text,
        icon,
        confirmButtonText: "Return Home",
        background: "#1a1a2e",
        color: "#fff",
      }).then(() => {
        setIsAlertActive(false);
        navigate("/home");
      });
    };

    socket.on("gameOver", handleGameOver);

    return () => {
      if (timer) clearInterval(timer);
      socket.off("gameOver", handleGameOver);
    };
  }, [timeLeft, userInput, currentLevelIndex, levels, gameId, dispatch, navigate]);
};