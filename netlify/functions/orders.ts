import type { Handler, HandlerEvent } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// NOTE: This function requires a valid Supabase JWT from the client.
// The client must pass the user's auth token in the Authorization header.

export const handler: Handler = async (event: HandlerEvent) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const authHeader = event.headers['authorization'] ?? '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  // Verify user via token
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData.user) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const user = userData.user;
  const admin = event.queryStringParameters?.['admin'] === 'true';

  if (event.httpMethod === 'GET') {
    if (admin) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) };
      }

      const { data: orders, error } = await supabase
        .from('orders')
        .select('*, order_items(quantity)')
        .order('created_at', { ascending: false });

      if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
      return { statusCode: 200, body: JSON.stringify({ orders }) };
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*, product:products(name, category))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    return { statusCode: 200, body: JSON.stringify({ orders }) };
  }

  return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
};
