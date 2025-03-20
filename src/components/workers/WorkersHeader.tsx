
import React from 'react';

const WorkersHeader: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto text-center mb-10">
      <div className="inline-block p-2 px-4 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3">
        Professional Directory
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Find Skilled Professionals in India</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Browse our directory of qualified workers ready to help with your next project
      </p>
    </div>
  );
};

export default WorkersHeader;
