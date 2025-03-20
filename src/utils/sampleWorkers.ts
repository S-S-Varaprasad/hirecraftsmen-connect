
import { supabase } from '@/integrations/supabase/client';
import { registerWorker } from '@/services/workerService';

// Sample worker data for different professions with Indian names and locations
const sampleWorkers = [
  {
    name: 'Raj Kumar',
    profession: 'Electrician',
    location: 'Mumbai, Maharashtra',
    experience: '8 years',
    hourly_rate: '₹450',
    skills: ['Wiring', 'Installation', 'Repairs', 'Lighting'],
    languages: ['Hindi', 'English', 'Marathi'],
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
    languages: ['Hindi', 'English', 'Punjabi'],
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
    languages: ['Hindi', 'English', 'Kannada', 'Urdu'],
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
    languages: ['Tamil', 'English', 'Telugu'],
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
    languages: ['Hindi', 'English', 'Telugu'],
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
    languages: ['Marathi', 'Hindi', 'English'],
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
    languages: ['Bengali', 'Hindi', 'English'],
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
    languages: ['Gujarati', 'Hindi', 'English'],
    about: 'Expert tailor specializing in custom clothing and alterations.',
    image_url: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    name: 'Aditya Mehta',
    profession: 'Driver',
    location: 'Jaipur, Rajasthan',
    experience: '10 years',
    hourly_rate: '₹350',
    skills: ['Safe Driving', 'Route Planning', 'Vehicle Maintenance', 'Customer Service'],
    languages: ['Hindi', 'English', 'Rajasthani'],
    about: 'Professional driver with clean record and excellent customer service skills.',
    image_url: 'https://randomuser.me/api/portraits/men/72.jpg'
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
    image_url: 'https://randomuser.me/api/portraits/women/33.jpg'
  },
  {
    name: 'Sanjay Kumar',
    profession: 'Cook',
    location: 'Kochi, Kerala',
    experience: '8 years',
    hourly_rate: '₹500',
    skills: ['Indian Cuisine', 'Baking', 'Meal Planning', 'Catering'],
    languages: ['Malayalam', 'English', 'Tamil', 'Hindi'],
    about: 'Experienced cook specializing in traditional and fusion Indian cuisine.',
    image_url: 'https://randomuser.me/api/portraits/men/55.jpg'
  },
  {
    name: 'Meera Pillai',
    profession: 'Babysitter',
    location: 'Goa',
    experience: '6 years',
    hourly_rate: '₹300',
    skills: ['Childcare', 'First Aid', 'Meal Preparation', 'Educational Activities'],
    languages: ['Konkani', 'English', 'Hindi'],
    about: 'Caring and reliable babysitter with experience in early childhood education.',
    image_url: 'https://randomuser.me/api/portraits/women/38.jpg'
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
