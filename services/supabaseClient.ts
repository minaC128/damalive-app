import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || '';

console.group('🛠️ Supabase Connection Debug');
console.log('URL found:', !!supabaseUrl);
console.log('Anon Key found:', !!supabaseAnonKey);
if (supabaseUrl) console.log('URL Prefix:', supabaseUrl.substring(0, 15) + '...');
console.groupEnd();

const isUrlValid = (url: string) => {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const isValid = isUrlValid(supabaseUrl) &&
    supabaseUrl !== 'your-supabase-project-url' &&
    supabaseUrl !== '';

if (!isValid) {
    console.error('❌ Supabase configuration missing! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.');
}

export const supabase = isValid
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: () => Promise.resolve({
                data: { user: null },
                error: new Error(`Supabase尚未設定！請確認 Vercel 環境變數是否包含 VITE_SUPABASE_URL。目前的 URL 是: "${supabaseUrl || '空的'}"`)
            }),
            signUp: () => Promise.resolve({
                data: { user: null },
                error: new Error('Supabase尚未設定，請檢查 Vercel 環境變數')
            }),
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
