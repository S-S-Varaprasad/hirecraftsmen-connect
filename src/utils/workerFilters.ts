
import { Worker } from '@/services/workerService';

// List of Indian locations to filter by
export const indianLocations = [
  'mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 
  'kolkata', 'pune', 'ahmedabad', 'jaipur', 'lucknow',
  'india', 'new delhi', 'goa', 'kerala', 'gujarat', 'rajasthan',
  'maharashtra', 'tamil nadu', 'karnataka', 'andhra pradesh'
];

// Filter workers to only show Indian profiles
export const getIndianWorkers = (workers: Worker[]): Worker[] => {
  return workers.filter(worker => {
    const workerLocation = worker.location.toLowerCase();
    // Check if worker location contains any Indian location
    return indianLocations.some(loc => workerLocation.includes(loc.toLowerCase()));
  });
};

export interface WorkerFilters {
  searchTerm?: string;
  location?: string;
  professions?: string[];
  availableOnly?: boolean;
  onlyIndian?: boolean;
}

export const applyFilters = (workers: Worker[], filters: WorkerFilters): Worker[] => {
  let results = [...workers];
  
  // Apply Indian filter first if requested
  if (filters.onlyIndian) {
    results = getIndianWorkers(results);
  }
  
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    results = results.filter(worker => 
      worker.name.toLowerCase().includes(term) || 
      worker.profession.toLowerCase().includes(term) ||
      worker.skills.some((skill: string) => skill.toLowerCase().includes(term))
    );
  }
  
  if (filters.location) {
    const location = filters.location.toLowerCase();
    results = results.filter(worker => 
      worker.location.toLowerCase().includes(location)
    );
  }
  
  if (filters.professions && filters.professions.length > 0) {
    results = results.filter(worker => 
      filters.professions?.some((p: string) => 
        worker.profession.toLowerCase().includes(p.toLowerCase())
      )
    );
  }
  
  if (filters.availableOnly) {
    results = results.filter(worker => worker.is_available);
  }
  
  return results;
};
