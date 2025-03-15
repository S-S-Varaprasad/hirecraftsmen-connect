
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
          <Avatar className="w-24 h-24 mb-4 border-4 border-primary/10 dark:border-primary/20 ring-2 ring-primary/20 shadow-lg">
            <AvatarImage 
              src={imageUrl} 
              alt={name}
              className="object-cover"
            />
            <AvatarFallback className="text-lg font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/90">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{name}</h3>
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
        
        <div className="pt-4 px-6 pb-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="hover:bg-primary/10 hover:text-primary hover:border-primary/20 dark:hover:bg-primary/10 dark:hover:border-primary/30" asChild>
              <Link to={`/message/${id}`}>Message</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link to={`/workers/${id}`}>View Profile</Link>
            </Button>
            <Button variant="default" className="col-span-2 mt-2 btn-hire-me" asChild>
              <Link to={`/apply/${id}`}>Hire Me</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
