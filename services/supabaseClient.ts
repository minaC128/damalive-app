import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || '';


const isUrlValid = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const isValid = isUrlValid(supabaseUrl) && supabaseUrl !== 'your-supabase-project-url';

if (!isValid) {
    console.warn('⚠️ Supabase URL is invalid or not set. Using mock client.');
}

export const supabase = isValid
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase尚未設定，請檢查 .env.local') }),
            signUp: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase尚未設定，請檢查 .env.local') }),
            signOut: () => Promise.resolve({ error: null }),
        },
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({ data: null, error: null }),
                    order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
                }),
            }),
        }),
    } as any;
