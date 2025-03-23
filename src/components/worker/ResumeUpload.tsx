
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ResumeUploadProps {
  resumeName: string | null;
  setResumeName: (name: string | null) => void;
  setResume: (file: File | null) => void;
}

const ResumeUpload = ({ resumeName, setResumeName, setResume }: ResumeUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Resume must be smaller than 10MB');
        return;
      }
      
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        toast.error('Resume must be a PDF or Word document');
        return;
      }
      
      setResume(file);
      setResumeName(file.name);
    }
  };

  return (
    <div className="mb-4">
      <Label htmlFor="resume" className="text-base">Resume</Label>
      <Input
        type="file"
        id="resume"
        name="resume"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="mt-1"
      />
      {resumeName && (
        <p className="mt-1 text-sm text-gray-500">Selected: {resumeName}</p>
      )}
    </div>
  );
};

export default ResumeUpload;
