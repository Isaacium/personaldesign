export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const authHeader = request.headers.get('Authorization');
    const queryPass = url.searchParams.get('password');

    let providedPassword = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      providedPassword = authHeader.substring(7).trim();
    } else if (queryPass) {
      providedPassword = queryPass.trim();
    }

    const expectedPassword = env.ADMIN_PASSWORD || 'IceCreamAdmin2026!';

    if (!providedPassword || providedPassword !== expectedPassword) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid password.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = env.INVITES_DB || env.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database binding (INVITES_DB / DB) not found.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Join RSVPs with Brackets
    const query = `
      SELECT 
        r.id as rsvp_id,
        r.name,
        r.email,
        r.attending,
        r.created_at as rsvp_created_at,
        b.id as bracket_id,
        b.bracket_data,
        b.created_at as bracket_created_at
      FROM rsvps r
      LEFT JOIN brackets b ON r.id = b.rsvp_id
      ORDER BY r.created_at DESC
    `;

    const { results } = await db.prepare(query).all();

    const formatted = (results || []).map(row => {
      let bracketObj = null;
      if (row.bracket_data) {
        try {
          bracketObj = typeof row.bracket_data === 'string' ? JSON.parse(row.bracket_data) : row.bracket_data;
        } catch (e) {
          bracketObj = row.bracket_data;
        }
      }
      return {
        id: row.rsvp_id,
        name: row.name,
        email: row.email,
        attending: Boolean(row.attending),
        created_at: row.rsvp_created_at,
        bracket: bracketObj
      };
    });

    return new Response(JSON.stringify({
      success: true,
      total_rsvps: formatted.length,
      attending_count: formatted.filter(r => r.attending).length,
      declined_count: formatted.filter(r => !r.attending).length,
      rsvps: formatted
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
