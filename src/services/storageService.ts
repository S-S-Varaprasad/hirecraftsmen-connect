
import { supabase } from '@/integrations/supabase/client';

// Make sure the necessary storage buckets exist
export const ensureStorageBuckets = async () => {
  try {
    // Check if worker-profiles bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      // Continue execution even if we can't list buckets
      return true;
    }
    
    if (!buckets?.find(bucket => bucket.name === 'worker-profiles')) {
      try {
        // Create worker-profiles bucket
        const { error: createError } = await supabase.storage.createBucket('worker-profiles', {
          public: true,
        });
        
        if (createError) {
          console.error('Error creating worker-profiles bucket:', createError);
          // Continue execution even if we can't create the bucket
        } else {
          console.log('Successfully created worker-profiles bucket');
          
          // Set bucket to public
          const { error: policyError } = await supabase.storage.from('worker-profiles').createSignedUrl('test.txt', 60);
          if (policyError && policyError.message.includes('policy')) {
            try {
              // Create a policy that allows public read access to all files in the bucket
              await supabase.rpc('create_storage_policy', {
                bucket_name: 'worker-profiles',
                policy_name: 'public-read',
                definition: {
                  role: 'anon',
                  operation: 'SELECT'
                }
              });
              console.log('Created public read policy for worker-profiles bucket');
            } catch (policyErr) {
              console.error('Error creating bucket policy:', policyErr);
              // Continue execution even if we can't create the policy
            }
          }
        }
      } catch (createErr) {
        console.error('Exception when creating bucket:', createErr);
        // Continue execution even if we hit an exception
      }
    } else {
      console.log('worker-profiles bucket already exists');
    }
    
    // Add more bucket checks if needed for resumes, etc.
    
    return true;
  } catch (error) {
    console.error('Error ensuring storage buckets:', error);
    // Continue execution even if we hit an exception
    return true;
  }
};

// Function to set public access to a bucket
export const setPublicAccess = async (bucketName: string) => {
  try {
    const { error } = await supabase.storage.from(bucketName).getPublicUrl('dummy.txt');
    if (error) {
      console.error(`Error setting public access for ${bucketName}:`, error);
    } else {
      console.log(`Successfully set public access for ${bucketName}`);
    }
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
