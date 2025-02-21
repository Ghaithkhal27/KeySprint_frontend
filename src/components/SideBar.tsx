import React from 'react';
import { motion } from 'framer-motion';

const SideBar: React.FC = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-64 h-screen bg-gradient-to-br from-indigo-900 to-[#0091ad] shadow-lg flex flex-col items-center justify-center p-4"
    >
      <motion.div
        className="mb-4 text-lg font-bold"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Total Matches
      </motion.div>
      <motion.div
        className="mb-4 text-lg font-bold"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Total Wins
      </motion.div>
      <motion.div
        className="mb-4 text-lg font-bold"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Total Losses
      </motion.div>
      <motion.div
        className="mb-4 text-lg font-bold"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        WPM
      </motion.div>
      <motion.div
        className="mb-4 text-lg font-bold"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Accuracy
      </motion.div>
      <motion.div
        className="text-lg font-bold"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Rank
      </motion.div>
    </motion.nav>
  );
};

export default SideBar;