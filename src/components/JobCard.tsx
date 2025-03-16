
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Briefcase, IndianRupee, Clock, Calendar, ArrowRight } from 'lucide-react';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  rate: string;
  urgency: 'Low' | 'Medium' | 'High';
  postedDate: string;
  skills: string[];
  description: string;
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  company,
  location,
  jobType,
  rate,
  urgency,
  postedDate,
  skills,
  description
}) => {
  // Determine badge color based on urgency
  const getBadgeColor = () => {
    switch (urgency) {
      case 'High':
        return 'bg-red-500 hover:bg-red-600';
      case 'Medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Low':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  // Truncate description to avoid too much text
  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-md animate-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="text-base">{company}</CardDescription>
          </div>
          <Badge className={getBadgeColor()}>
            {urgency} Priority
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
            <span>{jobType}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <IndianRupee className="w-4 h-4 mr-2 text-gray-500" />
            <span>{rate}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            <span>Posted {postedDate}</span>
          </div>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
          {truncateDescription(description)}
        </p>
        
        <div className="flex flex-wrap gap-1 mt-auto">
          {skills.slice(0, 3).map((skill, i) => (
            <Badge key={i} variant="outline" className="bg-gray-50 dark:bg-gray-800">{skill}</Badge>
          ))}
          {skills.length > 3 && (
            <Badge variant="outline" className="bg-transparent">+{skills.length - 3}</Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t">
        <div className="flex justify-between w-full">
          <Button variant="outline" asChild>
            <Link to={`/jobs/${id}`}>View Details</Link>
          </Button>
          <Button asChild>
            <Link to={`/apply/${id}`}>Apply Now</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
