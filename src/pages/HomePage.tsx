import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getAllGroup } from '../redux/gameSlice';
import { useNavigate } from 'react-router-dom';
import  {ButtonStart}  from '../components/Button';
import { useAcceptInvitation } from '../socketService/invitation';
import { usehandleOnlineUsers } from '../hooks/usehandleOnlineUsers';





const HomePage: React.FC = () => {
  useAcceptInvitation()
  usehandleOnlineUsers()

  

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const groups = useAppSelector((state) => state.game.groups);

  useEffect(() => {
    dispatch(getAllGroup());
  }, [dispatch]);

  const handleNavigate = (groupId: string) => {
    navigate("/UsersPage", { state: { groupId } });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1565c0] to-[#90caf9] py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {groups.map((group) => (
            <div 
              key={group.id}
              
              className=" cursor-pointer backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/10 "
            >
              <div className="overflow-hidden rounded-2xl mb-6">
                <img
                  src={group.imageUrl}
                  alt={group.name}
                  className="w-full h-48 object-cover rounded-2xl"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {group.name}
              </h3>
              <p className="text-blue-200 leading-relaxed">
                {group.description}
              </p>
              
              <div className="mt-12  flex justify-end ">
              <div onClick={() => handleNavigate(group.id)} className="absolute bottom-4 right-4"> 
                <ButtonStart />
                </div>
               
              </div>
            </div>
          ))}
        </div>

        {groups.length === 0 && (
          <div className="text-center py-24">
            <p className="text-2xl text-white/80">No categories available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;