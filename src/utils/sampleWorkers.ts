
import { supabase } from '@/integrations/supabase/client';
import { registerWorker } from '@/services/workerService';

// Sample worker data with Indian names and locations
const sampleWorkers = [
  {
    name: 'Rajesh Kumar',
    profession: 'Electrician',
    location: 'Mumbai, Maharashtra',
    experience: '8 years',
    hourly_rate: '₹450',
    skills: ['Wiring', 'Installation', 'Repairs', 'Lighting'],
    languages: ['Hindi', 'English', 'Marathi'],
    about: 'Experienced electrician with expertise in residential and commercial projects.',
    image_url: '/lovable-uploads/5c55a581-8181-4c77-aa02-5362c74cedf2.png'
  },
  {
    name: 'Priya Singh',
    profession: 'Plumber',
    location: 'Delhi, NCR',
    experience: '5 years',
    hourly_rate: '₹400',
    skills: ['Pipe Fitting', 'Repairs', 'Drainage', 'Installation'],
    languages: ['Hindi', 'English', 'Punjabi'],
    about: 'Professional plumber specializing in residential plumbing solutions.',
    image_url: '/lovable-uploads/e8ddebd8-54c9-450e-a765-8cf8b4a79b76.png'
  },
  {
    name: 'Amit Sharma',
    profession: 'Carpenter',
    location: 'Bengaluru, Karnataka',
    experience: '12 years',
    hourly_rate: '₹500',
    skills: ['Furniture Making', 'Woodworking', 'Cabinet Installation', 'Repairs'],
    languages: ['Hindi', 'English', 'Kannada'],
    about: 'Master carpenter with extensive experience in custom furniture and cabinetry.',
    image_url: '/lovable-uploads/f1738232-6943-4b8a-aa79-e83c67587da8.png'
  },
  {
    name: 'Lakshmi Devi',
    profession: 'Cleaner',
    location: 'Chennai, Tamil Nadu',
    experience: '4 years',
    hourly_rate: '₹300',
    skills: ['Deep Cleaning', 'Sanitization', 'House Keeping', 'Office Cleaning'],
    languages: ['Tamil', 'English', 'Telugu'],
    about: 'Experienced cleaner providing thorough and reliable cleaning services.',
    image_url: '/lovable-uploads/2aa2500e-82f5-4e87-a5d1-5e79db5b7f8b.png'
  },
  {
    name: 'Vikram Patel',
    profession: 'Painter',
    location: 'Hyderabad, Telangana',
    experience: '7 years',
    hourly_rate: '₹350',
    skills: ['Interior Painting', 'Exterior Painting', 'Wall Texturing', 'Refinishing'],
    languages: ['Hindi', 'English', 'Telugu'],
    about: 'Professional painter with attention to detail and quality finishes.',
    image_url: '/lovable-uploads/f36f852d-e4d0-4908-9c18-98dbb9681494.png'
  },
  {
    name: 'Ananya Desai',
    profession: 'Gardener',
    location: 'Pune, Maharashtra',
    experience: '6 years',
    hourly_rate: '₹320',
    skills: ['Landscaping', 'Plant Care', 'Garden Design', 'Maintenance'],
    languages: ['Marathi', 'Hindi', 'English'],
    about: 'Passionate gardener with expertise in creating and maintaining beautiful gardens.',
    image_url: '/lovable-uploads/2c40bb89-20b4-462d-87db-98c1edce958e.png'
  },
  {
    name: 'Sunil Verma',
    profession: 'Security Guard',
    location: 'Kolkata, West Bengal',
    experience: '9 years',
    hourly_rate: '₹280',
    skills: ['Surveillance', 'Access Control', 'Security Protocols', 'Emergency Response'],
    languages: ['Bengali', 'Hindi', 'English'],
    about: 'Professional security guard with background in military service.',
    image_url: '/lovable-uploads/80fa7af4-b36f-4ccc-b0eb-7228bf8c1a17.png'
  },
  {
    name: 'Meena Reddy',
    profession: 'Tailor',
    location: 'Ahmedabad, Gujarat',
    experience: '15 years',
    hourly_rate: '₹400',
    skills: ['Garment Construction', 'Alterations', 'Custom Designs', 'Embroidery'],
    languages: ['Gujarati', 'Hindi', 'English'],
    about: 'Expert tailor specializing in custom clothing and alterations.',
    image_url: '/lovable-uploads/e62f187e-caaf-4552-b1fc-d98fd2878f01.png'
  },
  {
    name: 'Rohan Khanna',
    profession: 'Driver',
    location: 'Jaipur, Rajasthan',
    experience: '10 years',
    hourly_rate: '₹350',
    skills: ['Safe Driving', 'Route Planning', 'Vehicle Maintenance', 'Customer Service'],
    languages: ['Hindi', 'English', 'Rajasthani'],
    about: 'Professional driver with clean record and excellent customer service skills.',
    image_url: '/lovable-uploads/2c40bb89-20b4-462d-87db-98c1edce958e.png'
  },
  {
    name: 'Neha Gupta',
    profession: 'House Cleaning',
    location: 'Lucknow, Uttar Pradesh',
    experience: '3 years',
    hourly_rate: '₹250',
    skills: ['Dusting', 'Mopping', 'Bathroom Cleaning', 'Kitchen Cleaning'],
    languages: ['Hindi', 'English', 'Urdu'],
    about: 'Reliable house cleaner offering thorough cleaning services for homes and apartments.',
    image_url: '/lovable-uploads/d9650b91-3e58-4c46-a4ea-7072b4c5995c.png'
  },
  {
    name: 'Rajan Iyer',
    profession: 'Cook',
    location: 'Kochi, Kerala',
    experience: '8 years',
    hourly_rate: '₹500',
    skills: ['Indian Cuisine', 'Baking', 'Meal Planning', 'Catering'],
    languages: ['Malayalam', 'English', 'Tamil', 'Hindi'],
    about: 'Experienced cook specializing in traditional and fusion Indian cuisine.',
    image_url: '/lovable-uploads/208c9f41-1354-48e6-bbf3-c160a8dc338b.png'
  },
  {
    name: 'Arjun Pillai',
    profession: 'Babysitter',
    location: 'Goa',
    experience: '6 years',
    hourly_rate: '₹300',
    skills: ['Childcare', 'First Aid', 'Meal Preparation', 'Educational Activities'],
    languages: ['Konkani', 'English', 'Hindi'],
    about: 'Caring and reliable babysitter with experience in early childhood education.',
    image_url: '/lovable-uploads/0f8c59f2-eb94-486a-a4c2-8e46b51ec9af.png'
  }
];

// Function to add sample workers to the database
export const addSampleWorkers = async () => {
  try {
    // Check if we already have workers
    const { count, error } = await supabase
      .from('workers')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error checking workers count:', error);
      return false;
    }
    
    // Only add sample workers if there are fewer than 5 workers
    if (count !== null && count < 5) {
      console.log(`Only ${count} workers found, adding sample workers...`);
      
      for (const worker of sampleWorkers) {
        try {
          await registerWorker({
            name: worker.name,
            profession: worker.profession,
            location: worker.location,
            experience: worker.experience,
            hourly_rate: worker.hourly_rate,
            skills: worker.skills,
            languages: worker.languages,
            is_available: true,
            image_url: worker.image_url,
            about: worker.about,
            user_id: null, // Sample workers don't have user accounts
          });
          console.log(`Added sample worker: ${worker.name}`);
        } catch (workerError) {
          console.error(`Error adding sample worker ${worker.name}:`, workerError);
        }
      }
      
      console.log('Sample workers added successfully');
      return true;
    } else {
      console.log(`Already have ${count} workers, skipping sample data`);
    }
    
    return false;
  } catch (error) {
    console.error('Error adding sample workers:', error);
    return false;
  }
};
