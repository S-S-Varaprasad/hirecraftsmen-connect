
import { supabase } from '@/integrations/supabase/client';
import { registerWorker } from '@/services/workerService';

// Sample worker data for different professions
const sampleWorkers = [
  {
    name: 'Raj Kumar',
    profession: 'Electrician',
    location: 'Mumbai, Maharashtra',
    experience: '8 years',
    hourly_rate: '₹450',
    skills: ['Wiring', 'Installation', 'Repairs', 'Lighting'],
    about: 'Experienced electrician with expertise in residential and commercial projects.',
    image_url: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Priya Singh',
    profession: 'Plumber',
    location: 'Delhi, NCR',
    experience: '5 years',
    hourly_rate: '₹400',
    skills: ['Pipe Fitting', 'Repairs', 'Drainage', 'Installation'],
    about: 'Professional plumber specializing in residential plumbing solutions.',
    image_url: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'Mohammad Ali',
    profession: 'Carpenter',
    location: 'Bengaluru, Karnataka',
    experience: '12 years',
    hourly_rate: '₹500',
    skills: ['Furniture Making', 'Woodworking', 'Cabinet Installation', 'Repairs'],
    about: 'Master carpenter with extensive experience in custom furniture and cabinetry.',
    image_url: 'https://randomuser.me/api/portraits/men/22.jpg'
  },
  {
    name: 'Lakshmi Devi',
    profession: 'Cleaner',
    location: 'Chennai, Tamil Nadu',
    experience: '4 years',
    hourly_rate: '₹300',
    skills: ['Deep Cleaning', 'Sanitization', 'House Keeping', 'Office Cleaning'],
    about: 'Experienced cleaner providing thorough and reliable cleaning services.',
    image_url: 'https://randomuser.me/api/portraits/women/29.jpg'
  },
  {
    name: 'Rahul Sharma',
    profession: 'Painter',
    location: 'Hyderabad, Telangana',
    experience: '7 years',
    hourly_rate: '₹350',
    skills: ['Interior Painting', 'Exterior Painting', 'Wall Texturing', 'Refinishing'],
    about: 'Professional painter with attention to detail and quality finishes.',
    image_url: 'https://randomuser.me/api/portraits/men/62.jpg'
  },
  {
    name: 'Ananya Patel',
    profession: 'Gardener',
    location: 'Pune, Maharashtra',
    experience: '6 years',
    hourly_rate: '₹320',
    skills: ['Landscaping', 'Plant Care', 'Garden Design', 'Maintenance'],
    about: 'Passionate gardener with expertise in creating and maintaining beautiful gardens.',
    image_url: 'https://randomuser.me/api/portraits/women/52.jpg'
  },
  {
    name: 'Vikram Singh',
    profession: 'Security Guard',
    location: 'Kolkata, West Bengal',
    experience: '9 years',
    hourly_rate: '₹280',
    skills: ['Surveillance', 'Access Control', 'Security Protocols', 'Emergency Response'],
    about: 'Professional security guard with background in military service.',
    image_url: 'https://randomuser.me/api/portraits/men/41.jpg'
  },
  {
    name: 'Kavita Reddy',
    profession: 'Tailor',
    location: 'Ahmedabad, Gujarat',
    experience: '15 years',
    hourly_rate: '₹400',
    skills: ['Garment Construction', 'Alterations', 'Custom Designs', 'Embroidery'],
    about: 'Expert tailor specializing in custom clothing and alterations.',
    image_url: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];

// Function to add sample workers to the database
export const addSampleWorkers = async () => {
  try {
    // Check if we already have workers
    const { count } = await supabase
      .from('workers')
      .select('*', { count: 'exact', head: true });
    
    // Only add sample workers if there are fewer than 5 workers
    if (count !== null && count < 5) {
      for (const worker of sampleWorkers) {
        await registerWorker({
          name: worker.name,
          profession: worker.profession,
          location: worker.location,
          experience: worker.experience,
          hourly_rate: worker.hourly_rate,
          skills: worker.skills,
          is_available: true,
          image_url: worker.image_url,
          about: worker.about,
          user_id: null, // Sample workers don't have user accounts
        });
      }
      console.log('Sample workers added successfully');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error adding sample workers:', error);
    return false;
  }
};
