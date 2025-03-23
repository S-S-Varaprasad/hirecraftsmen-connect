
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkerProfiles } from '@/hooks/useWorkerProfiles';
import { getIndianWorkers } from '@/utils/workerFilters';
import { 
  Wrench, 
  Zap, 
  PaintBucket, 
  Shield, 
  Settings, 
  HardHat,
  Utensils,
  Droplet,
  Hammer,
  Search
} from 'lucide-react';

type IconType = 
  | 'Wrench' 
  | 'Zap' 
  | 'PaintBucket' 
  | 'Shield' 
  | 'Settings' 
  | 'HardHat'
  | 'Utensils'
  | 'Droplet'
  | 'Hammer'
  | 'Search';

interface CategoryCardProps {
  title: string;
  icon: IconType;
  description: string;
  slug: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  icon,
  description,
  slug,
}) => {
  const { workers } = useWorkerProfiles();
  const [availableWorkers, setAvailableWorkers] = useState(0);
  
  // Render the appropriate icon based on the icon prop
  const renderIcon = () => {
    const iconProps = { className: "h-5 w-5 text-primary" };
    
    switch (icon) {
      case 'Wrench':
        return <Wrench {...iconProps} />;
      case 'Zap':
        return <Zap {...iconProps} />;
      case 'PaintBucket':
        return <PaintBucket {...iconProps} />;
      case 'Shield':
        return <Shield {...iconProps} />;
      case 'Settings':
        return <Settings {...iconProps} />;
      case 'HardHat':
        return <HardHat {...iconProps} />;
      case 'Utensils':
        return <Utensils {...iconProps} />;
      case 'Droplet':
        return <Droplet {...iconProps} />;
      case 'Hammer':
        return <Hammer {...iconProps} />;
      case 'Search':
        return <Search {...iconProps} />;
      default:
        return <Wrench {...iconProps} />;
    }
  };
  
  // Update count whenever workers data changes
  useEffect(() => {
    if (workers && workers.length > 0) {
      // First filter to only get Indian workers
      const indianWorkers = getIndianWorkers(workers);
      
      const professionToMatch = title.toLowerCase();
      
      // Count workers that match this category and are available
      const count = indianWorkers.filter(worker => {
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
      to={`/workers/by-category/${slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="p-6">
        <div className="mb-4 w-14 h-14 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-full">
          {renderIcon()}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {availableWorkers > 0 ? (
            <>{availableWorkers} available worker{availableWorkers !== 1 ? 's' : ''}</>
          ) : (
            <>No available workers</>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
