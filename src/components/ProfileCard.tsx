
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileCardProps {
  id: string;
  name: string;
  profession: string;
  location: string;
  rating: number;
  experience: string;
  hourlyRate: string;
  skills: string[];
  isAvailable: boolean;
  imageUrl: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  name,
  profession,
  location,
  rating,
  experience,
  hourlyRate,
  skills,
  isAvailable,
  imageUrl,
}) => {
  // Get the initials for the fallback avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-card hover:shadow-elevated transition-all duration-300 animate-in">
      <div className="absolute top-4 right-4 z-10">
        <Badge variant={isAvailable ? "default" : "secondary"} className={`flex items-center gap-1 px-2 py-1 text-xs ${isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}>
          <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-200' : 'bg-gray-300'}`}></span>
          {isAvailable ? 'Available' : 'Unavailable'}
        </Badge>
      </div>
      
      <div className="flex flex-col h-full">
        <div className="relative pt-6 px-6 pb-4 flex flex-col items-center text-center">
          <Avatar className="w-20 h-20 mb-3 border-2 border-orange-100 dark:border-orange-900/30">
            <AvatarImage 
              src={imageUrl || '/placeholder.svg'} 
              alt={name}
              className="object-cover"
            />
            <AvatarFallback className="text-lg font-medium bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{profession}</p>
          
          <div className="flex items-center mt-2 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
              />
            ))}
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
          </div>

          <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{location}</span>
          </div>
        </div>
        
        <div className="flex-1 px-6 pb-4">
          <div className="flex flex-wrap gap-1 mb-4">
            {skills.slice(0, 3).map((skill, i) => (
              <Badge key={i} variant="outline" className="bg-gray-50 dark:bg-gray-800">{skill}</Badge>
            ))}
            {skills.length > 3 && (
              <Badge variant="outline" className="bg-transparent">+{skills.length - 3}</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{experience}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{hourlyRate}/hr</span>
            </div>
          </div>
        </div>
        
        <div className="pt-4 px-6 pb-6 border-t border-gray-100 dark:border-gray-700">
          <div className="flex gap-2">
            <Button variant="outline" className="w-1/2 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 dark:hover:bg-orange-950/20 dark:hover:border-orange-900/30" asChild>
              <Link to={`/message/${id}`}>Message</Link>
            </Button>
            <Button className="w-1/2 bg-[#F97316] hover:bg-[#EA580C]" asChild>
              <Link to={`/workers/${id}`}>View Profile</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
