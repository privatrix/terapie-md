import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(
    envConfig.NEXT_PUBLIC_SUPABASE_URL,
    envConfig.SUPABASE_SERVICE_ROLE_KEY
);

async function createBucket() {
    console.log("Attempting to create blog-images bucket...");
    const { data, error } = await supabase.storage.createBucket('blog-images', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
    });

    if (error) {
        console.error("Error creating bucket:", error);
        // If it says it exists, that's weird given previous check, but we can verify again
    } else {
        console.log("Bucket created successfully:", data);
    }
}

createBucket();
