import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getProfile } from "../redux/userSlice";
import { EnvelopeIcon, LinkIcon,TrophyIcon ,FaceFrownIcon,EllipsisHorizontalCircleIcon    } from "@heroicons/react/24/solid";
import { usehandleOnlineUsers } from "../hooks/usehandleOnlineUsers";
import { useAcceptInvitation } from "../socketService/invitation";

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);
  const typingTestScore = profile?.scores?.[0];

   useEffect(()=>{
      console.log("accuracy rank WPM in profile",typingTestScore?.WPM,typingTestScore?.accuracy,typingTestScore?.rank );
      
            console.log(profile);
            
    },[typingTestScore?.WPM])
    usehandleOnlineUsers()
    useAcceptInvitation()



 
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-[#0091ad] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 sm:p-12 space-y-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <img
                src={profile?.avatarUrl}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {profile?.username}
                <span className="ml-2 text-purple-600">✨</span>
              </h1>
              <p className="text-lg text-gray-600 flex items-center justify-center space-x-2">
                <EnvelopeIcon className="w-5 h-5 text-purple-500" />
                <span>{profile?.email}</span>
              </p>
            </div>
          </div>

          <div className="prose prose-lg text-center text-gray-700 max-w-none">
            {profile?.bio ||
              "No bio available yet. Write something about yourself!"}
          </div>

          {profile && (
            <div className="border-t border-gray-100 pt-8">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2 text-gray-600 justify-center">
                  <LinkIcon className="w-5 h-5 text-purple-500" />
                  <span>
                    Joined {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="flex items-center space-x-2 bg-white/50 rounded-lg px-4 py-2 shadow-sm">
                  <TrophyIcon className="w-5 h-5 text-[#ffb703]" />
                    <span className="font-medium text-purple-600">
                      {profile?.totalWins}
                    </span>
                    <span className="text-gray-600">Total Wins</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/50 rounded-lg px-4 py-2 shadow-sm">
                  <FaceFrownIcon className="w-5 h-5 text-[#780000]" />
                    <span className="font-medium text-purple-600">
                      {profile?.totalLosses}
                    </span>
                    <span className="text-gray-600">Total Losses</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/50 rounded-lg px-4 py-2 shadow-sm">
                  <EllipsisHorizontalCircleIcon className="w-5 h-5 text-[#219ebc]" />

                    <span className="font-medium text-purple-600">
                      {profile?.totalMatches}
                    </span>
                    <span className="text-gray-600">Total Matches</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/50 rounded-lg px-4 py-2 shadow-sm">
                    <span className="font-medium text-purple-600">
                      {typingTestScore?.WPM}
                    </span>
                    <span className="text-gray-600">WPM</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/50 rounded-lg px-4 py-2 shadow-sm">
                    <span className="font-medium text-purple-600">
                      {typingTestScore?.accuracy}%
                    </span>
                    <span className="text-gray-600">Accuracy</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/50 rounded-lg px-4 py-2 shadow-sm">
                    <span className="font-medium text-purple-600">
                      #{typingTestScore?.rank}
                    </span>
                    <span className="text-gray-600">Rank</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;