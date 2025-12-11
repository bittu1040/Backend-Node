import { createClient } from '@supabase/supabase-js';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // store this in .env
);

export const verifySupabaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  const { data, error } = await supabase.auth.getUser(token);
  console.log('Supabase Auth Data:', data);
  if (error || !data?.user) return res.status(401).json({ error: 'Invalid token' });

  const supabaseId = data.user.id;
  const email = data.user.email;
  const name = data.user.user_metadata?.full_name || data.user.user_metadata?.name || '';

  // Check if user exists in the database mongodb
  let user = await User.findOne({ supabaseId });
  if (!user) {
    try {
      user = await User.create({ supabaseId, email, name });
    } catch (err) {
      if (err.code === 11000) {
        // Duplicate key error — fallback to find existing user
        user = await User.findOne({ email });
      } else {
        return res.status(500).json({ error: 'User creation failed' });
      }
    }
  }

  req.user = user;
  next();
};

