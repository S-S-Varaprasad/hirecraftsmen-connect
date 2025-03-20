
import { supabase } from '@/integrations/supabase/client';

// Make sure the necessary storage buckets exist
export const ensureStorageBuckets = async () => {
  try {
    // Check if worker-profiles bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return false;
    }
    
    if (!buckets?.find(bucket => bucket.name === 'worker-profiles')) {
      // Create worker-profiles bucket
      const { error: createError } = await supabase.storage.createBucket('worker-profiles', {
        public: true,
      });
      
      if (createError) {
        console.error('Error creating worker-profiles bucket:', createError);
        return false;
      }
      
      console.log('Successfully created worker-profiles bucket');
    } else {
      console.log('worker-profiles bucket already exists');
    }
    
    // Add more bucket checks if needed for resumes, etc.
    
    return true;
  } catch (error) {
    console.error('Error ensuring storage buckets:', error);
    return false;
  }
};
