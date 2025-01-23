import { createClient } from '@supabase/supabase-js';

// 環境変数を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 環境変数のチェック
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing Supabase configuration in environment variables. 
    Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.`
  );
}

// Supabaseクライアントの作成
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ログ用に情報を表示（本番環境では削除することを推奨）
console.info('Supabase client initialized with URL:', supabaseUrl);

export default supabase;
