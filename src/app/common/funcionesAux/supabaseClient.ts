import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yriyyxaabwjoearnnxts.supabase.co'
const supabaseKey = 'sb_publishable_7rcChgTOz1JdyKvRjb9A6w_YEpGnuvz'

export const supabase = createClient(supabaseUrl, supabaseKey)