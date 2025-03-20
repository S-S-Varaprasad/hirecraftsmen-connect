
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { useWorkerProfiles } from '@/hooks/useWorkerProfiles';

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
  slug: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  icon: Icon,
  description,
  slug,
}) => {
  const { workers } = useWorkerProfiles();
  const [availableWorkers, setAvailableWorkers] = useState(0);
  
  // Update count whenever workers data changes
  useEffect(() => {
    if (workers && workers.length > 0) {
      const professionToMatch = title.toLowerCase();
      
      // Count workers that match this category and are available
      const count = workers.filter(worker => {
        const workerProfession = worker.profession.toLowerCase();
        const isMatch = workerProfession.includes(professionToMatch) || 
                       worker.skills.some((skill: string) => skill.toLowerCase().includes(professionToMatch));
        return isMatch && worker.is_available;
      }).length;
      
      setAvailableWorkers(count);
    }
  }, [workers, title]);

  return (
    <Link 
      to={`/workers/category/${slug}`}
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-card hover:shadow-elevated transition-all duration-300 animate-in"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="p-6">
        <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary/90">
          <Icon className="w-6 h-6" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
        
        <div className="text-sm font-medium text-primary dark:text-primary/90">
          {availableWorkers} available worker{availableWorkers !== 1 ? 's' : ''}
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
