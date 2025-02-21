import { useEffect } from "react";
import { socket } from "../socketService/socket";
import { useAppDispatch } from "../redux/hooks";
import { setOnlineUsers } from "../redux/userSlice";
import useConnection from "../socketService/useConnection";



export const  usehandleOnlineUsers=()=>{
    const dispatch=useAppDispatch()
    useConnection()

    useEffect(() => {
        const handleOnlineUsers = (userIds: string[]) => {
            dispatch(setOnlineUsers(userIds));
        };
    
        socket.on('onlineUsers', handleOnlineUsers);
        socket.emit('getOnlineUsers');
    
        return () => {
          socket.off('onlineUsers', handleOnlineUsers);
        };
      }, []);
}