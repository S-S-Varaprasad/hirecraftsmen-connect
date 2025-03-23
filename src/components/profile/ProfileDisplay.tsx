
import React from 'react';
import { Worker } from '@/services/workerService';
import { Button } from '@/components/ui/button';
import { FileEdit } from 'lucide-react';
import { MapPin, Clock, DollarSign, UserCheck, Award, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileImageUpload from './ProfileImageUpload';

interface ProfileDisplayProps {
  worker: Worker;
  onEdit: () => void;
}

const ProfileDisplay = ({ worker, onEdit }: ProfileDisplayProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">Worker Profile</h3>
        <Button 
          variant="orange"
          size="sm" 
          onClick={onEdit}
          className="flex items-center gap-1"
        >
          <FileEdit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <ProfileImageUpload 
        worker={worker} 
        isEditing={false} 
        onImageUpload={async () => {}} 
        uploading={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
          <p className="mt-1 text-base font-medium">{worker.name}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Profession</h3>
          <p className="mt-1 text-base font-medium">{worker.profession}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Location</h3>
          <div className="mt-1 flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-gray-500" />
            <span>{worker.location}</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Experience</h3>
          <div className="mt-1 flex items-center">
            <Clock className="w-4 h-4 mr-1 text-gray-500" />
            <span>{worker.experience}</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Hourly Rate</h3>
          <div className="mt-1 flex items-center">
            <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
            <span>{worker.hourly_rate}</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Availability</h3>
          <p className="mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              worker.is_available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {worker.is_available ? (
                <>
                  <UserCheck className="w-3 h-3 mr-1" />
                  Available
                </>
              ) : (
                'Not Available'
              )}
            </span>
          </p>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {worker.skills.map((skill, index) => (
            <span 
              key={index} 
              className="bg-app-orange/10 text-app-orange text-xs font-medium px-3 py-1 rounded-full flex items-center"
            >
              <Award className="w-3 h-3 mr-1" />
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Languages</h3>
        <div className="flex flex-wrap gap-2">
          {worker.languages && worker.languages.length > 0 ? (
            worker.languages.map((language, index) => (
              <span 
                key={index} 
                className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full flex items-center"
              >
                <Languages className="w-3 h-3 mr-1" />
                {language}
              </span>
            ))
          ) : (
            <span className="text-gray-500">No languages specified</span>
          )}
        </div>
      </div>
      
      {worker.about && (
        <div>
          <h3 className="text-sm font-medium text-gray-500">About</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-400">{worker.about}</p>
        </div>
      )}
      
      <div className="flex flex-wrap gap-3 pt-4 border-t">
        <Button
          variant="outline"
          className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
          onClick={() => navigate(`/deactivate-worker/${worker.id}`)}
        >
          Deactivate Profile
        </Button>
        <Button
          variant="outline"
          className="text-red-600 border-red-300 hover:bg-red-50"
          onClick={() => navigate(`/delete-worker/${worker.id}`)}
        >
          Delete Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileDisplay;
