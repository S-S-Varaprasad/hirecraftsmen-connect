
import React, { useState } from 'react';
import { Search, MapPin, Filter, X, Briefcase, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";

interface SearchFiltersProps {
  onSearch: (filters: any) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);

  const professions = [
    'Carpenter', 'Electrician', 'Plumber', 'Painter', 'Mechanic', 
    'Chef', 'Security Guard', 'Housekeeper', 'Mason'
  ];

  const handleSearch = () => {
    onSearch({
      searchTerm,
      location,
      availableOnly,
      professions: selectedProfessions
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setAvailableOnly(false);
    setSelectedProfessions([]);
    onSearch({});
  };

  const toggleProfession = (profession: string) => {
    if (selectedProfessions.includes(profession)) {
      setSelectedProfessions(selectedProfessions.filter(p => p !== profession));
    } else {
      setSelectedProfessions([...selectedProfessions, profession]);
    }
  };

  const activeFiltersCount = [
    searchTerm,
    location,
    availableOnly ? 1 : 0,
    ...selectedProfessions
  ].filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <Input
              type="text"
              placeholder="Search by name, skills, or profession..."
              className="pl-10 pr-4 py-3 h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div className="relative w-full md:w-72">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <MapPin className="w-5 h-5" />
            </div>
            <Input
              type="text"
              placeholder="Location (city, state)"
              className="pl-10 pr-4 py-3 h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-12 px-4 border-gray-200 dark:border-gray-700 relative"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 shadow-lg border border-gray-200 dark:border-gray-700" align="end">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                  <h4 className="font-medium">Filter Options</h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-8 px-2"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear all
                  </Button>
                </div>
                
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <span className="text-sm font-medium mr-2">Available workers only</span>
                    </label>
                    <Switch
                      checked={availableOnly}
                      onCheckedChange={setAvailableOnly}
                    />
                  </div>
                </div>
                
                <div className="p-4">
                  <Collapsible open={true}>
                    <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                        <span>Professions</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {selectedProfessions.length} selected
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-1">
                        {professions.map((profession) => (
                          <div 
                            key={profession}
                            className={`px-3 py-2 text-sm rounded-md cursor-pointer flex items-center space-x-2 ${
                              selectedProfessions.includes(profession) 
                                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/90' 
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => toggleProfession(profession)}
                          >
                            {selectedProfessions.includes(profession) ? (
                              <Check className="w-4 h-4 text-primary" />
                            ) : (
                              <div className="w-4 h-4" />
                            )}
                            <span>{profession}</span>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
                
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <Button 
                    className="w-full"
                    onClick={() => {
                      handleSearch();
                    }}
                  >
                    Apply Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button 
              onClick={handleSearch}
              className="h-12"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
        
        {(searchTerm || location || availableOnly || selectedProfessions.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            {searchTerm && (
              <Badge variant="secondary" className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm">
                <span className="mr-1">Search:</span> {searchTerm}
                <button 
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => {
                    setSearchTerm('');
                    handleSearch();
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            {location && (
              <Badge variant="secondary" className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm">
                <span className="mr-1">Location:</span> {location}
                <button 
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => {
                    setLocation('');
                    handleSearch();
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            {availableOnly && (
              <Badge variant="secondary" className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm">
                Available Only
                <button 
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => {
                    setAvailableOnly(false);
                    handleSearch();
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            
            {selectedProfessions.map(profession => (
              <Badge key={profession} variant="secondary" className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm">
                {profession}
                <button 
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => {
                    toggleProfession(profession);
                    handleSearch();
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            
            <button 
              className="text-sm text-primary hover:underline"
              onClick={clearFilters}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
