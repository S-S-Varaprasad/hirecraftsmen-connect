
import React from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Search } from 'lucide-react';

const WorkersHeader: React.FC = () => {
  return (
    <motion.div 
      className="max-w-3xl mx-auto text-center mb-16 relative z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4 gap-2"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Users className="w-4 h-4" />
        <span>Professional Directory</span>
      </motion.div>
      
      <motion.h1 
        className="text-4xl font-bold text-gray-900 dark:text-white mb-5 tracking-tight"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        Find Skilled Professionals in India
      </motion.h1>
      
      <motion.p 
        className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        Browse our directory of qualified workers ready to help with your next project
      </motion.p>
      
      <motion.div 
        className="flex flex-wrap justify-center mt-8 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm">Popular in Delhi</span>
        </div>
        
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
          <Search className="w-4 h-4 text-primary" />
          <span className="text-sm">40+ Categories</span>
        </div>
      </motion.div>
      
      <div className="absolute -z-10 inset-0 overflow-hidden blur-3xl" aria-hidden="true">
        <div className="absolute -z-10 bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu overflow-hidden blur-3xl">
          <div
            className="aspect-[1155/678] w-[36.1875rem] bg-gradient-to-tr from-primary to-amber-500 opacity-20"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default WorkersHeader;
