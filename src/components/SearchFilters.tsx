
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { SearchInput } from '@/components/ui/search-input';
import { commonSearchTerms, popularLocations, professions } from '@/utils/suggestions';

interface SearchFiltersProps {
  onSearch: (filters: any) => void;
  initialSearchTerm?: string;
  initialLocation?: string;
}

const SearchFilters = ({ onSearch, initialSearchTerm = '', initialLocation = '' }: SearchFiltersProps) => {
  const isMobile = useIsMobile();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [location, setLocation] = useState(initialLocation);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    if (initialSearchTerm || initialLocation) {
      handleSearch();
    }
  }, []);

  const handleSearch = () => {
    onSearch({
      searchTerm,
      location,
      professions: selectedProfessions,
      availableOnly,
    });
  };

  const toggleProfession = (profession: string) => {
    setSelectedProfessions(prev => 
      prev.includes(profession)
        ? prev.filter(p => p !== profession)
        : [...prev, profession]
    );
  };

  const resetFilters = () => {
    setSelectedProfessions([]);
    setAvailableOnly(false);
  };

  const availableProfessions = professions;

  const filterContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Categories</h3>
        <div className="grid grid-cols-2 gap-2">
          {availableProfessions.map((profession) => (
            <div key={profession} className="flex items-center space-x-2">
              <Checkbox 
                id={`profession-${profession}`}
                checked={selectedProfessions.includes(profession)}
                onCheckedChange={() => toggleProfession(profession)}
              />
              <Label 
                htmlFor={`profession-${profession}`}
                className="text-sm"
              >
                {profession}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="availableOnly"
          checked={availableOnly}
          onCheckedChange={() => setAvailableOnly(!availableOnly)}
        />
        <Label htmlFor="availableOnly">Available Workers Only</Label>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-3 w-full">
        <div className="flex-1">
          <SearchInput
            placeholder="Search for skilled workers"
            suggestions={commonSearchTerms}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg"
          />
        </div>
        
        <div className="flex">
          <SearchInput
            placeholder="Location" 
            suggestions={popularLocations}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full md:w-40 lg:w-56 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg"
            icon={<MapPin className="h-5 w-5 text-gray-400" />}
          />
        </div>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[500px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              {filterContent}
              <SheetFooter className="pt-4 flex flex-row gap-2">
                <Button variant="outline" onClick={resetFilters} className="flex-1">
                  Reset
                </Button>
                <Button 
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  onClick={() => {
                    handleSearch();
                    document.body.click(); // This is a hack to close the sheet
                  }}
                >
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ) : (
          <>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-1 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </>
        )}
        
        <Button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600">
          Search
        </Button>
      </div>
      
      {showFilters && !isMobile && (
        <Card className="mt-3 absolute z-10 w-[300px] right-4">
          <CardContent className="pt-4">
            {filterContent}
            
            <div className="flex justify-between mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
              <Button 
                onClick={() => {
                  handleSearch();
                  setShowFilters(false);
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchFilters;
