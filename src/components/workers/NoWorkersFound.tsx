
import React from 'react';
import { Briefcase } from 'lucide-react';

const NoWorkersFound: React.FC = () => {
  return (
    <div className="text-center py-20 bg-white/80 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800/80 dark:border-gray-700">
      <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
        <Briefcase className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No workers found</h3>
      <p className="text-gray-600 dark:text-gray-400">
        Try adjusting your search filters or criteria
      </p>
    </div>
  );
};

export default NoWorkersFound;
