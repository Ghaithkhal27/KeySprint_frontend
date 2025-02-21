import { useMemo } from "react";
import { useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";

export const useTypingStats = () => {
  const { selectedText, selectedTime, userInput, correctChars, initialTime } =
    useAppSelector((state: RootState) => state.typing);

  const correctWords = useMemo(() => {
    const inputWords = userInput.trim().split(/\s+/);
    const textWords = selectedText.trim().split(/\s+/);
    let correctCount = 0;

    for (let i = 0; i < inputWords.length; i++) {
      if (inputWords[i] === textWords[i]) {
        correctCount++;
      }
    }
    return correctCount;
  }, [userInput, selectedText]);

  const wpm = useMemo(() => {
    if (initialTime === 0 || selectedTime >= initialTime) return 0;
    const timeElapsedInMinutes = (initialTime - selectedTime) / 60;
    return timeElapsedInMinutes > 0 ? Math.round(correctWords / timeElapsedInMinutes) : 0;
  }, [correctWords, initialTime, selectedTime]);



  const accuracy = useMemo(() => {
    if (userInput.length === 0) return 0;
    const totalTyped = Math.min(userInput.length, selectedText.length);
    return totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 0;
  }, [correctChars, userInput.length, selectedText.length]);

  return { wpm, accuracy };
};