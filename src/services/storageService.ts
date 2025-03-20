
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
    
    const workerProfilesBucket = buckets?.find(bucket => bucket.name === 'worker-profiles');
    const resumesBucket = buckets?.find(bucket => bucket.name === 'resumes');
    
    console.log('Existing buckets:', buckets?.map(b => b.name));
    
    // Create worker-profiles bucket if it doesn't exist
    if (!workerProfilesBucket) {
      try {
        const { error: createError } = await supabase.storage.createBucket('worker-profiles', {
          public: true,
        });
        
        if (createError) {
          console.error('Error creating worker-profiles bucket:', createError);
        } else {
          console.log('Successfully created worker-profiles bucket');
        }
      } catch (createErr) {
        console.error('Exception when creating worker-profiles bucket:', createErr);
      }
    } else {
      console.log('worker-profiles bucket already exists');
    }
    
    // Create resumes bucket if it doesn't exist
    if (!resumesBucket) {
      try {
        const { error: createError } = await supabase.storage.createBucket('resumes', {
          public: true,
        });
        
        if (createError) {
          console.error('Error creating resumes bucket:', createError);
        } else {
          console.log('Successfully created resumes bucket');
        }
      } catch (createErr) {
        console.error('Exception when creating resumes bucket:', createErr);
      }
    } else {
      console.log('resumes bucket already exists');
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring storage buckets:', error);
    return false;
  }
};

// Function to set public access to a bucket
export const setPublicAccess = async (bucketName: string) => {
  try {
    // We use getPublicUrl which doesn't actually return an error property
    const { data } = supabase.storage.from(bucketName).getPublicUrl('dummy.txt');
    console.log(`Successfully accessed ${bucketName} bucket:`, data.publicUrl);
    return true;
  } catch (error) {
    console.error(`Error accessing ${bucketName}:`, error);
    return false;
  }
};

// Function to create test file to verify bucket functionality
export const createTestFile = async (bucketName: string) => {
  try {
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload('test.txt', testFile, { upsert: true });
      
    if (error) {
      console.error(`Error creating test file in ${bucketName}:`, error);
      return false;
    }
    
    console.log(`Successfully created test file in ${bucketName}:`, data);
    return true;
  } catch (error) {
    console.error(`Error creating test file in ${bucketName}:`, error);
    return false;
  }
};
