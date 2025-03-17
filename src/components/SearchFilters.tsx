
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useMobile } from '@/hooks/use-mobile';

interface SearchFiltersProps {
  onSearch: (filters: any) => void;
  initialSearchTerm?: string;
  initialLocation?: string;
}

const SearchFilters = ({ onSearch, initialSearchTerm = '', initialLocation = '' }: SearchFiltersProps) => {
  const isMobile = useMobile();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [location, setLocation] = useState(initialLocation);
  const [professions, setProfessions] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    // If initial values are provided, trigger search automatically
    if (initialSearchTerm || initialLocation) {
      handleSearch();
    }
  }, []);

  const handleSearch = () => {
    onSearch({
      searchTerm,
      location,
      professions,
      availableOnly,
    });
  };

  const toggleProfession = (profession: string) => {
    setProfessions(prev => 
      prev.includes(profession)
        ? prev.filter(p => p !== profession)
        : [...prev, profession]
    );
  };

  const resetFilters = () => {
    setProfessions([]);
    setAvailableOnly(false);
  };

  const availableProfessions = [
    'Carpenter', 'Plumber', 'Electrician', 'Painter', 'Mason', 
    'Mechanic', 'Driver', 'Chef', 'Cleaner', 'Security Guard', 
    'Gardener', 'Tailor'
  ];

  const filterContent = (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Categories</h3>
        <div className="grid grid-cols-2 gap-2">
          {availableProfessions.map((profession) => (
            <div key={profession} className="flex items-center space-x-2">
              <Checkbox 
                id={`profession-${profession}`}
                checked={professions.includes(profession)}
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
        <div className="flex-1 flex items-center pl-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <Search className="h-5 w-5 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Search for skilled workers" 
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center pl-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <MapPin className="h-5 w-5 text-gray-400" />
          <Input 
            type="text" 
            placeholder="Location" 
            className="w-full md:w-40 lg:w-56 border-0 focus-visible:ring-0 focus-visible:ring-offset-0" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
