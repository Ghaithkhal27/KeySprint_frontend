import { useEffect } from "react";
import { socket } from "./socket";
import { decodedToken } from "../utils/decodedToken";

const useConnection = () => {
    useEffect(() => {
        if (!decodedToken?.id) return; 

        const registerUser = () => {
            console.log("Connected to server:", socket.id);
            socket.emit("register", decodedToken.id);
        };

        if (socket.connected) {
            registerUser(); 
        }

        socket.on("connect", registerUser);
        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        return () => {
            socket.off("connect", registerUser);
            socket.off("disconnect");
        };
    }, []);
};

export default useConnection;
