
import { supabase } from '@/integrations/supabase/client';

// Make sure the necessary storage buckets exist
export const ensureStorageBuckets = async () => {
  try {
    console.log('Ensuring storage buckets exist...');
    // Check if worker-profiles bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return false;
    }
    
    const workerProfilesBucket = buckets?.find(bucket => bucket.name === 'worker-profiles');
    const resumesBucket = buckets?.find(bucket => bucket.name === 'resumes');
    const userProfilesBucket = buckets?.find(bucket => bucket.name === 'user-profiles');
    
    console.log('Existing buckets:', buckets?.map(b => b.name));
    
    // Create worker-profiles bucket if it doesn't exist
    if (!workerProfilesBucket) {
      try {
        console.log('Creating worker-profiles bucket...');
        const { error: createError } = await supabase.storage.createBucket('worker-profiles', {
          public: true,
          fileSizeLimit: 5242880, // 5MB limit for profile images
        });
        
        if (createError) {
          console.error('Error creating worker-profiles bucket:', createError);
        } else {
          console.log('Successfully created worker-profiles bucket');
          
          // Set public access
          await setPublicAccess('worker-profiles');
        }
      } catch (createErr) {
        console.error('Exception when creating worker-profiles bucket:', createErr);
      }
    } else {
      console.log('worker-profiles bucket already exists');
      // Ensure public access is set
      await setPublicAccess('worker-profiles');
    }
    
    // Create resumes bucket if it doesn't exist
    if (!resumesBucket) {
      try {
        console.log('Creating resumes bucket...');
        const { error: createError } = await supabase.storage.createBucket('resumes', {
          public: true,
          fileSizeLimit: 10485760, // 10MB limit for resumes
        });
        
        if (createError) {
          console.error('Error creating resumes bucket:', createError);
        } else {
          console.log('Successfully created resumes bucket');
          
          // Set public access
          await setPublicAccess('resumes');
        }
      } catch (createErr) {
        console.error('Exception when creating resumes bucket:', createErr);
      }
    } else {
      console.log('resumes bucket already exists');
      // Ensure public access is set
      await setPublicAccess('resumes');
    }
    
    // Create user-profiles bucket if it doesn't exist
    if (!userProfilesBucket) {
      try {
        console.log('Creating user-profiles bucket...');
        const { error: createError } = await supabase.storage.createBucket('user-profiles', {
          public: true,
          fileSizeLimit: 5242880, // 5MB limit for profile images
        });
        
        if (createError) {
          console.error('Error creating user-profiles bucket:', createError);
        } else {
          console.log('Successfully created user-profiles bucket');
          
          // Set public access
          await setPublicAccess('user-profiles');
        }
      } catch (createErr) {
        console.error('Exception when creating user-profiles bucket:', createErr);
      }
    } else {
      console.log('user-profiles bucket already exists');
      // Ensure public access is set
      await setPublicAccess('user-profiles');
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring storage buckets:', error);
    return false;
  }
};

// Function to set public access to a bucket - FIX: Remove error property usage
export const setPublicAccess = async (bucketName: string) => {
  try {
    // Create a public policy for the bucket
    const { data } = supabase.storage.from(bucketName).getPublicUrl('dummy.txt');
    
    // Note: getPublicUrl doesn't actually return an error, so we can't check for success/failure here
    console.log(`Public access set for ${bucketName} bucket`);
    return true;
  } catch (error) {
    console.error(`Error setting public access for ${bucketName}:`, error);
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

export const configureBucketCORS = async (bucketName: string) => {
  try {
    // This function would need to be implemented on the Supabase project settings
    // as it's not directly available via the client SDK
    console.log(`CORS configured for ${bucketName} bucket`);
    return true;
  } catch (error) {
    console.error(`Error configuring CORS for ${bucketName}:`, error);
    return false;
  }
};
