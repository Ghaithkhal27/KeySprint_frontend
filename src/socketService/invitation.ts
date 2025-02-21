import { useEffect } from "react";
import Swal from "sweetalert2";
import { socket } from "./socket";
import { useNavigate } from "react-router-dom";

export const useAcceptInvitation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleInvitation = (data: {
      senderId: string;
      senderName: string;
      groupId: string;
      gameId: string;
    }) => {
      Swal.fire({
        title: `🎮 ${data.senderName} invites you!`,
        text: "Accept to start playing!",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Accept",
        cancelButtonText: "Decline",
        timer: 4000,
        timerProgressBar: true,
        background: "#1a1a2e",
        color: "#fff",
      }).then((result) => {
        if (result.isConfirmed) {
          socket.emit("confirmInvitation", {
            gameId: data.gameId,
            groupId: data.groupId,
          });
          navigate("/levels", {
            state: { GroupId: data.groupId, gameId: data.gameId },
          });
        }
      });
    };

    socket.on("acceptInvitation", handleInvitation);
    return () => {
      socket.off("acceptInvitation", handleInvitation);
    };
  }, [navigate]);
};