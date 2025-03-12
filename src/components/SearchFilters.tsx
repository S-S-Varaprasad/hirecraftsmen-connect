import React, { useState } from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SearchFiltersProps {
  onSearch: (filters: any) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);

  const professions = [
    'Painter', 'Carpenter', 'Plumber', 'Welder', 
    'Architect', 'Electrician', 'Mason', 'Landscaper', 
    'Mechanic', 'Security Guard', 'Chef', 'House Cleaner',
    'Wedding Planner', 'HVAC Technician'
  ];

  const handleSearch = () => {
    onSearch({
      searchTerm,
      location,
      professions: selectedProfessions,
      availableOnly,
    });
  };

  const toggleProfession = (profession: string) => {
    if (selectedProfessions.includes(profession)) {
      setSelectedProfessions(selectedProfessions.filter(p => p !== profession));
    } else {
      setSelectedProfessions([...selectedProfessions, profession]);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setSelectedProfessions([]);
    setAvailableOnly(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 animate-in">
      <div className="px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by skill, profession, or keyword"
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative sm:w-1/3">
            <Input
              type="text"
              placeholder="Location"
              className="w-full"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <Button 
            variant="default" 
            className="shrink-0" 
            onClick={handleSearch}
          >
            Search
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="shrink-0 flex items-center gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-in">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Filter Results</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-sm text-gray-500 dark:text-gray-400"
                onClick={clearFilters}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear all
              </Button>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Profession</h4>
              <div className="flex flex-wrap gap-2">
                {professions.map(profession => (
                  <Badge 
                    key={profession}
                    variant={selectedProfessions.includes(profession) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleProfession(profession)}
                  >
                    {profession}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mb-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={availableOnly}
                  onChange={() => setAvailableOnly(!availableOnly)}
                />
                <span className="text-sm font-medium">Show only available workers</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
