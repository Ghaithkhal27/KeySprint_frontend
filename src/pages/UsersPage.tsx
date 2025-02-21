import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getAllUsers } from "../redux/userSlice";
import { decodedToken } from "../utils/decodedToken";
import { useLocation, useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { socket } from "../socketService/socket";
import Swal from "sweetalert2";
import { usehandleOnlineUsers } from "../hooks/usehandleOnlineUsers";
import { useAcceptInvitation } from "../socketService/invitation";

const UsersPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const GroupId = location.state?.groupId;
  const dispatch = useAppDispatch();
  const { users, onlineUsers } = useAppSelector((state) => state.user);
  const token = decodedToken;
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    dispatch(getAllUsers());

    const handleNavigation = (data: { groupId: string; gameId: string }) => {
      navigate("/levels", {
        state: { GroupId: data.groupId, gameId: data.gameId },
      });
    };

    socket.on("navigateToLevel", handleNavigation);
    return () => {
      socket.off("navigateToLevel", handleNavigation);
    };
  }, [dispatch, navigate]);
  usehandleOnlineUsers();
  useAcceptInvitation();

  const handleInvite = (receiverId: string) => {
    if (onlineUsers.includes(receiverId)) {
      Swal.fire({
        title: "Sending Invite...",
        text: "Waiting for user response",
        timer: 1000,
        timerProgressBar: true,
        didOpen: () =>{ Swal.showLoading()},
        background: "#1a1a2e",
        color: "#fff",
      
      });
      socket.emit("sendInvitation", {
        senderId: decodedToken.id,
        receiverId: receiverId,
        senderName: decodedToken.username,
        groupId: GroupId,
      });
    } else {
      Swal.fire({
        title: "User Offline",
        text: "This user is currently unavailable",
        icon: "error",
        background: "#1a1a2e",
        color: "#fff",
        confirmButtonColor: "#3b82f6",
        timer: 1000,
        timerProgressBar: true,
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.id !== token.id &&
      (user.username.toLowerCase().includes(searchInput.toLowerCase()) ||
        user.email.toLowerCase().includes(searchInput.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-[#0091ad] p-8">
      <div className="max-w-6xl mx-auto">
      <div className="relative bg-black/30 backdrop-blur-lg rounded-xl p-4 shadow-xl">
            <div className="flex items-center gap-4">
              <MagnifyingGlassIcon className="w-6 h-6 text-purple-400" />
              <input
                type="text"
                placeholder="Search players..."
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-400
                  text-lg font-medium"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>

        <div className="bg-gradient-to-br from-[#0091ad] to-indigo-900 rounded-xl shadow-lg border border-gray-100 overflow-hidden mt-8">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-4 border-b border-gray-100 hover:text-[#fff] hover:bg-indigo-900/80 cursor-pointer"
              onClick={() => handleInvite(user.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <img src={user.avatarUrl} alt={user.username} />
                </div>

                <div>
                  <div className={"text-[#00000] font-medium"}>
                    {user.username}
                  </div>
                  <div className="text-[#00000]">{user.email}</div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      onlineUsers.includes(user.id)
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {onlineUsers.includes(user.id) ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
