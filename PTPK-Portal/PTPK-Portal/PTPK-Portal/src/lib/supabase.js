import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sbejvpmtqbftsloaylen.supabase.co';
const supabaseAnonKey = 'sb_publishable_xyiBScTf0QJBATLJgHpaVw_cP6GXIfY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
