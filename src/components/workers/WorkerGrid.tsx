
import React, { useState, useEffect } from 'react';
import ProfileCard from '@/components/ProfileCard';
import { Worker } from '@/services/workerService';
import { getIndianWorkers } from '@/utils/workerFilters';
import { Canvas } from '@react-three/fiber';
import { useMediaQuery } from '@/hooks/use-mobile';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryRefresh } from '@/hooks/useQueryRefresh';

interface WorkerGridProps {
  workers: Worker[];
  regionFilter?: string;
}

// 3D floating particles around the workers grid
const FloatingParticles = () => {
  return <Stars radius={50} depth={50} count={500} factor={4} saturation={0} fade speed={1} />;
};

const WorkerGrid: React.FC<WorkerGridProps> = ({ workers, regionFilter = 'all' }) => {
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Set up real-time updates for workers table
  useQueryRefresh(['workers'], [['workers']]);

  useEffect(() => {
    // Filter workers based on regionFilter
    if (regionFilter === 'india' || regionFilter === 'all') {
      setFilteredWorkers(getIndianWorkers(workers));
    } else {
      // For future filters
      setFilteredWorkers(workers);
    }
  }, [workers, regionFilter]);
  
  return (
    <div className="relative">
      {!isMobile && (
        <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
          <Canvas style={{ position: 'absolute' }}>
            <PerspectiveCamera makeDefault position={[0, 0, 25]} />
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={0.5} />
            <FloatingParticles />
          </Canvas>
        </div>
      )}
      
      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            staggerChildren: 0.1
          }}
        >
          {filteredWorkers.map((worker, index) => (
            <motion.div
              key={worker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.05
              }}
              onHoverStart={() => setHoverIndex(index)}
              onHoverEnd={() => setHoverIndex(null)}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <ProfileCard 
                id={worker.id} 
                name={worker.name}
                profession={worker.profession}
                location={worker.location}
                rating={worker.rating || 4.5}
                experience={worker.experience}
                hourlyRate={worker.hourly_rate}
                skills={worker.skills}
                isAvailable={worker.is_available}
                imageUrl={worker.image_url || '/placeholder.svg'}
                userId={worker.user_id}
                className={`three-d-card ${hoverIndex === index ? 'shadow-xl' : ''}`}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WorkerGrid;
