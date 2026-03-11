import { createClient } from '@supabase/supabase-js';

// Requires SUPABASE_URL and SUPABASE_ANON_KEY to be set in environment
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpdate() {
  // First get any user ID to test with
  const { data: profiles, error: getError } = await supabase.from('profiles').select('*').limit(1);
  
  if (getError) {
    console.error('Failed to get profiles:', getError);
    return;
  }
  
  if (!profiles || profiles.length === 0) {
    console.log('No profiles found to test with.');
    return;
  }
  
  const testUid = profiles[0].uid;
  console.log(`Testing update on UID: ${testUid}`);
  console.log('Current Profile:', profiles[0]);
  
  // Try to update with test data
  const testData = {
    uid: testUid,
    name: profiles[0].name || 'Test User',
    avatar: profiles[0].avatar || '',
    lmp_date: '2023-01-01',
    due_date: '2023-10-08',
    birth_date: '2023-10-10',
    baby_name: 'TestBaby',
    is_postpartum: false,
    updated_at: new Date().toISOString()
  };
  
  console.log('Attempting upsert with:', testData);
  
  const { data, error } = await supabase.from('profiles').upsert(testData);
  
  if (error) {
    console.error('💥 UPSERT FAILED WITH ERROR:');
    console.error(JSON.stringify(error, null, 2));
  } else {
    console.log('✅ Upsert succeeded!', data);
  }
}

testUpdate();
