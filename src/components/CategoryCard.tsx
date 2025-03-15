
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
  availableWorkers: number;
  slug: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  icon: Icon,
  description,
  availableWorkers,
  slug,
}) => {
  return (
    <Link 
      to={`/workers/category/${slug}`}
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-card hover:shadow-elevated transition-all duration-300 animate-in"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="p-6">
        <div className="mb-4 w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
          <Icon className="w-6 h-6" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
        
        <div className="text-sm font-medium text-orange-600 dark:text-orange-400">
          {availableWorkers} available workers
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
