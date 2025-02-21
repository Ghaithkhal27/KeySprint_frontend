import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { registerUser, setEmail, setPassword, setusername } from '../redux/authSlice';
import { EnvelopeIcon, LockClosedIcon, ArrowPathIcon, UserIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const username = useAppSelector((state) => state.auth.username);
  const email = useAppSelector((state) => state.auth.email);
  const password = useAppSelector((state) => state.auth.password);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPassword(""));
    dispatch(setEmail(""));
    dispatch(setusername(""));
  }, [dispatch]);

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      const resultAction = await dispatch(registerUser({ username, email, password }));
      if (registerUser.fulfilled.match(resultAction)) {
        navigate('/HomePage');
        dispatch(setPassword(""));
        dispatch(setEmail(""));
        dispatch(setusername(""));
      } else {
        console.log('Registration failed');
      }
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8"
      >
        <form onSubmit={handleRegister}>
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-blue-500 p-3 rounded-full shadow-lg"
            >
              <LockClosedIcon className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome
            </h1>
            <p className="text-gray-500 mt-2">Please sign up to continue</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <div className="relative mt-1">
                <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => dispatch(setusername(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                  placeholder="Name"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => dispatch(setEmail(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => dispatch(setPassword(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                  placeholder="Password"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              onClick={handleRegister} 
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              <ArrowPathIcon className="w-5 h-5 animate-spin mr-2 hidden" /> {/* Add loading spinner logic */}
              Sign Up 
            </motion.button>

            <div className="text-center">
              <Link
                to="/Login"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-block hover:underline underline-offset-4"
              >
                If you have an account, please log in
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;