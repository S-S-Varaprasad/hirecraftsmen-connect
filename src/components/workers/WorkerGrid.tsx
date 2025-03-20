
import React from 'react';
import ProfileCard from '@/components/ProfileCard';
import { Worker } from '@/services/workerService';

interface WorkerGridProps {
  workers: Worker[];
}

const WorkerGrid: React.FC<WorkerGridProps> = ({ workers }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workers.map((worker) => (
        <ProfileCard 
          key={worker.id} 
          id={worker.id}
          name={worker.name}
          profession={worker.profession}
          location={worker.location}
          rating={worker.rating || 4.5}
          experience={worker.experience}
          hourlyRate={worker.hourly_rate}
          skills={worker.skills}
          isAvailable={worker.is_available}
          imageUrl={worker.image_url}
          userId={worker.user_id}
        />
      ))}
    </div>
  );
};

export default WorkerGrid;
