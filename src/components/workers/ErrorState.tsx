
import React from 'react';

const ErrorState: React.FC = () => {
  return (
    <div className="text-center py-20 bg-white/80 rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800/80 dark:border-gray-700 max-w-md mx-auto px-4">
      <h3 className="text-xl font-semibold mb-2">Error loading workers</h3>
      <p className="text-gray-600 dark:text-gray-400">
        There was a problem fetching the worker data. Please try again later.
      </p>
    </div>
  );
};

export default ErrorState;
