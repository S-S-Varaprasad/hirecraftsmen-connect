
import { supabase } from '@/integrations/supabase/client';

// Make sure the necessary storage buckets exist
export const ensureStorageBuckets = async () => {
  try {
    // Check if worker-profiles bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    
    if (!buckets?.find(bucket => bucket.name === 'worker-profiles')) {
      // Create worker-profiles bucket
      await supabase.storage.createBucket('worker-profiles', {
        public: true,
      });
      
      // Set bucket policy to public
      await supabase.storage.getBucket('worker-profiles');
    }
    
    // Add more bucket checks if needed for resumes, etc.
    
    return true;
  } catch (error) {
    console.error('Error ensuring storage buckets:', error);
    return false;
  }
};
