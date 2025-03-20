
import { supabase } from '@/integrations/supabase/client';
import { registerWorker } from '@/services/workerService';

// Sample worker data with authentic Indian names and locations
const sampleWorkers = [
  {
    name: 'Priya Sharma',
    profession: 'Plumber',
    location: 'Mumbai, Maharashtra',
    experience: '5 years',
    hourly_rate: '₹400',
    skills: ['Pipe Fitting', 'Drain Cleaning', 'Leak Repair', 'Installation'],
    languages: ['Hindi', 'English', 'Marathi'],
    about: 'Professional plumber specializing in residential plumbing solutions with expertise in leak detection and repair.',
    image_url: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'Arjun Patel',
    profession: 'Carpenter',
    location: 'Ahmedabad, Gujarat',
    experience: '12 years',
    hourly_rate: '₹500',
    skills: ['Furniture Making', 'Cabinet Installation', 'Framing', 'Repairs'],
    languages: ['Gujarati', 'Hindi', 'English'],
    about: 'Master carpenter with extensive experience in custom furniture and cabinetry. Specialized in traditional Gujarati woodworking techniques.',
    image_url: 'https://randomuser.me/api/portraits/men/22.jpg'
  },
  {
    name: 'Divya Reddy',
    profession: 'Painter',
    location: 'Hyderabad, Telangana',
    experience: '6 years',
    hourly_rate: '₹350',
    skills: ['Interior Painting', 'Exterior Painting', 'Color Consultation', 'Wall Texturing'],
    languages: ['Telugu', 'Hindi', 'English'],
    about: 'Professional painter with attention to detail and quality finishes. Experienced in both modern and traditional painting styles.',
    image_url: 'https://randomuser.me/api/portraits/women/52.jpg'
  },
  {
    name: 'Vikram Singh',
    profession: 'HVAC Technician',
    location: 'Delhi, NCR',
    experience: '10 years',
    hourly_rate: '₹550',
    skills: ['AC Installation', 'Heating Systems', 'Ventilation', 'Repairs'],
    languages: ['Hindi', 'English', 'Punjabi'],
    about: 'Expert HVAC technician with specialization in climate control solutions for residential and commercial buildings.',
    image_url: 'https://randomuser.me/api/portraits/men/62.jpg'
  },
  {
    name: 'Lakshmi Iyer',
    profession: 'House Cleaner',
    location: 'Chennai, Tamil Nadu',
    experience: '4 years',
    hourly_rate: '₹300',
    skills: ['Deep Cleaning', 'Move-in/Move-out', 'Regular Maintenance', 'Sanitization'],
    languages: ['Tamil', 'English', 'Malayalam'],
    about: 'Reliable house cleaner offering thorough and detailed cleaning services for homes and apartments. Specializes in eco-friendly cleaning solutions.',
    image_url: 'https://randomuser.me/api/portraits/women/33.jpg'
  },
  {
    name: 'Rajesh Kumar',
    profession: 'Landscaper',
    location: 'Bengaluru, Karnataka',
    experience: '7 years',
    hourly_rate: '₹400',
    skills: ['Garden Design', 'Lawn Maintenance', 'Irrigation Systems', 'Plant Care'],
    languages: ['Kannada', 'Hindi', 'English'],
    about: 'Passionate landscaper with expertise in creating and maintaining beautiful gardens suited to local climate conditions.',
    image_url: 'https://randomuser.me/api/portraits/men/41.jpg'
  },
  {
    name: 'Ananya Deshmukh',
    profession: 'Electrician',
    location: 'Pune, Maharashtra',
    experience: '8 years',
    hourly_rate: '₹450',
    skills: ['Wiring', 'Installation', 'Repairs', 'Lighting'],
    languages: ['Marathi', 'Hindi', 'English'],
    about: 'Experienced electrician with expertise in residential and commercial projects. Specializes in energy-efficient solutions.',
    image_url: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    name: 'Suresh Nair',
    profession: 'Cook',
    location: 'Kochi, Kerala',
    experience: '9 years',
    hourly_rate: '₹500',
    skills: ['Indian Cuisine', 'Baking', 'Meal Planning', 'Catering'],
    languages: ['Malayalam', 'English', 'Tamil', 'Hindi'],
    about: 'Experienced chef specializing in traditional and fusion Indian cuisine. Expert in authentic Kerala dishes and seafood specialties.',
    image_url: 'https://randomuser.me/api/portraits/men/55.jpg'
  },
  {
    name: 'Ravi Verma',
    profession: 'Driver',
    location: 'Jaipur, Rajasthan',
    experience: '10 years',
    hourly_rate: '₹350',
    skills: ['Safe Driving', 'Route Planning', 'Vehicle Maintenance', 'Customer Service'],
    languages: ['Hindi', 'English', 'Rajasthani'],
    about: 'Professional driver with clean record and excellent customer service skills. Familiar with all major routes throughout Rajasthan.',
    image_url: 'https://randomuser.me/api/portraits/men/72.jpg'
  },
  {
    name: 'Kavita Gupta',
    profession: 'Tailor',
    location: 'Chandigarh, Punjab',
    experience: '14 years',
    hourly_rate: '₹400',
    skills: ['Garment Construction', 'Alterations', 'Custom Designs', 'Embroidery'],
    languages: ['Punjabi', 'Hindi', 'English'],
    about: 'Expert tailor specializing in custom clothing and alterations. Specializes in traditional Punjabi attire and bridal wear.',
    image_url: 'https://randomuser.me/api/portraits/women/38.jpg'
  },
  {
    name: 'Deepak Banerjee',
    profession: 'Security Guard',
    location: 'Kolkata, West Bengal',
    experience: '8 years',
    hourly_rate: '₹280',
    skills: ['Surveillance', 'Access Control', 'Security Protocols', 'Emergency Response'],
    languages: ['Bengali', 'Hindi', 'English'],
    about: 'Professional security guard with background in military service. Trained in modern security techniques and crisis management.',
    image_url: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Meera Pillai',
    profession: 'Babysitter',
    location: 'Thiruvananthapuram, Kerala',
    experience: '6 years',
    hourly_rate: '₹300',
    skills: ['Childcare', 'First Aid', 'Meal Preparation', 'Educational Activities'],
    languages: ['Malayalam', 'English', 'Hindi'],
    about: 'Caring and reliable babysitter with experience in early childhood education. Creates a nurturing environment for children of all ages.',
    image_url: 'https://randomuser.me/api/portraits/women/29.jpg'
  },
  // Added a new worker to ensure the file changes
  {
    name: 'Ajay Mehta',
    profession: 'Electrician',
    location: 'Surat, Gujarat',
    experience: '9 years',
    hourly_rate: '₹480',
    skills: ['Commercial Wiring', 'Troubleshooting', 'Smart Home Installation', 'Electrical Maintenance'],
    languages: ['Gujarati', 'Hindi', 'English'],
    about: 'Skilled electrician with expertise in both residential and commercial settings. Specializing in smart home technology integration.',
    image_url: 'https://randomuser.me/api/portraits/men/36.jpg'
  }
];

// Function to add sample workers to the database
export const addSampleWorkers = async () => {
  try {
    console.log('Checking for existing workers...');
    // Check if we already have workers
    const { count, error } = await supabase
      .from('workers')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error checking workers count:', error);
      return false;
    }
    
    // Only add sample workers if there are no workers yet
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

// Export a function to force add sample workers regardless of existing count
export const forceAddSampleWorkers = async () => {
  try {
    console.log('Force adding sample workers...');
    
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
          user_id: null,
        });
        console.log(`Added sample worker: ${worker.name}`);
      } catch (workerError) {
        console.error(`Error adding sample worker ${worker.name}:`, workerError);
      }
    }
    
    console.log('Sample workers force-added successfully');
    return true;
  } catch (error) {
    console.error('Error force-adding sample workers:', error);
    return false;
  }
};
