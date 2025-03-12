
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  description,
}) => {
  const urgencyColors = {
    Low: 'bg-blue-500',
    Medium: 'bg-yellow-500',
    High: 'bg-red-500',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-card hover:shadow-elevated transition-all duration-300 animate-in">
      <div className="px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{company}</p>
          </div>
          <div className="mt-2 sm:mt-0">
            <Badge className={`${urgencyColors[urgency]} hover:${urgencyColors[urgency]}`}>
              {urgency} Urgency
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 mb-4 text-sm">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">{location}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">{jobType}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">{rate}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">{postedDate}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-gray-50 dark:bg-gray-800">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <Button variant="outline" asChild>
            <Link to={`/jobs/${id}`}>View Details</Link>
          </Button>
          <Button asChild>
            <Link to={`/apply/${id}`}>Apply Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
